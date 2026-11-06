<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Notifications\Email;

use App\Domains\Application\Data\Notifications\Email\UpdateMailboxData;
use App\Domains\Application\Policies\Notifications\EmailMailboxAccessPolicy;
use App\Domains\Domain\DTOs\Notifications\MailboxUpdateResultDTO;
use App\Domains\Domain\Enums\Notifications\EmailDeliveryStatus;
use App\Domains\Domain\Enums\Notifications\EmailMailboxOperation;
use App\Domains\Domain\Exceptions\Notifications\EmailMailboxUnavailable;
use App\Domains\Domain\Models\Notifications\EmailDelivery;
use App\Domains\Domain\Models\Notifications\EmailMailboxState;
use App\Domains\Infrastructure\Mail\Notifications\GmailFolderMailbox;
use App\Domains\Infrastructure\Mail\Notifications\GmailImapClient;
use App\Domains\Application\Queries\Settings\GetMailSettingsQuery;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Throwable;

final readonly class UpdateMailboxAction
{
    public function __construct(
        private EmailMailboxAccessPolicy $access,
        private GetMailSettingsQuery $settings,
        private GmailFolderMailbox $mailbox,
        private RecordGmailFolderAction $record,
    ) {}

    public function execute(UpdateMailboxData $data, int $userId): MailboxUpdateResultDTO
    {
        $emails = EmailDelivery::query()->whereKey($data->ids)->get();
        foreach ($emails as $email) {
            $this->access->ensureCanView($email, $userId);
        }
        $settings = $this->settings->execute();
        $move = $data->operation->movesFolder();
        $sync = $move && ($settings?->syncsGmailFolders() ?? false);
        $hash = hash('sha256', strtolower((string) $settings?->username));
        $result = ['gmail' => 0, 'local' => 0, 'failed' => 0, 'error' => null];
        $client = null;
        $lock = $sync ? Cache::lock('gmail-folders:'.$hash, 90) : null;
        if ($lock !== null && ! $lock->get()) {
            throw new EmailMailboxUnavailable('Já existe uma sincronização de pastas em andamento. Aguarde e tente novamente.');
        }
        try {
            $folders = null;
            $deadline = microtime(true) + 35;
            foreach ($emails as $email) {
                try {
                    if (microtime(true) >= $deadline) {
                        throw new EmailMailboxUnavailable('O lote atingiu o limite de tempo. Selecione as mensagens restantes para continuar.');
                    }
                    $remote = $sync && filled($email->message_id) && in_array($email->status, [
                        EmailDeliveryStatus::SENT, EmailDeliveryStatus::BOUNCED,
                        EmailDeliveryStatus::RECEIVED, EmailDeliveryStatus::UNCONFIRMED,
                    ], true);
                    if ($remote) {
                        $recordHash = $email->gmail_account_hash ?? ($email->payload['account_hash'] ?? null);
                        if ($recordHash !== null && ! hash_equals($hash, $recordHash)) {
                            throw new EmailMailboxUnavailable('Uma mensagem pertence a outra conta Gmail. A pasta dela foi preservada.');
                        }
                        $client ??= new GmailImapClient($settings);
                        $folders ??= $this->mailbox->folders($client);
                        $location = $this->mailbox->move($client, $email, $folders, $data->operation);
                        // O estado compartilhado só muda depois da confirmação do Gmail.
                        $this->record->execute($email, $location, $hash);
                        $result['gmail']++;

                        continue;
                    }
                    $attributes = match ($data->operation) {
                        EmailMailboxOperation::READ => ['is_read' => true],
                        EmailMailboxOperation::UNREAD => ['is_read' => false],
                        EmailMailboxOperation::STAR => ['starred' => true],
                        EmailMailboxOperation::UNSTAR => ['starred' => false],
                        EmailMailboxOperation::RESTORE => ['folder' => null],
                        EmailMailboxOperation::LABEL => ['tag_id' => $data->label],
                        default => ['folder' => $data->operation->value],
                    };
                    EmailMailboxState::query()->updateOrCreate(
                        ['email_delivery_id' => $email->id, 'user_id' => $userId], $attributes,
                    );
                    $result['local']++;
                } catch (Throwable $exception) {
                    $result['failed']++;
                    $result['error'] ??= $exception instanceof EmailMailboxUnavailable
                        ? $exception->getMessage() : 'Não foi possível concluir a atualização. Use Sincronizar pastas para conferir o resultado antes de repetir.';
                    Log::warning('Falha ao organizar mensagem da Inbox.', ['email_delivery_id' => $email->id, 'error_type' => $exception::class]);
                }
            }

            return new MailboxUpdateResultDTO(
                gmail: $result['gmail'], local: $result['local'], failed: $result['failed'], error: $result['error'],
            );
        } finally {
            $client?->close();
            $lock?->release();
        }
    }
}
