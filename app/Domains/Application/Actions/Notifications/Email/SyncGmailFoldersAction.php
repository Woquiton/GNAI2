<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Notifications\Email;

use App\Domains\Domain\Enums\Notifications\EmailDeliveryStatus;
use App\Domains\Domain\Models\Notifications\EmailDelivery;
use App\Domains\Infrastructure\Mail\Notifications\GmailFolderMailbox;
use App\Domains\Infrastructure\Mail\Notifications\GmailImapClient;
use App\Domains\Application\Queries\Settings\GetMailSettingsQuery;
use Illuminate\Support\Facades\Cache;

final readonly class SyncGmailFoldersAction
{
    public function __construct(
        private GetMailSettingsQuery $settings,
        private GmailFolderMailbox $mailbox,
        private RecordGmailFolderAction $record,
    ) {}

    public function execute(): ?int
    {
        $settings = $this->settings->execute();
        if ($settings === null || ! $settings->syncsGmailFolders()) {
            return 0;
        }
        $hash = hash('sha256', strtolower((string) $settings->username));
        $count = Cache::lock('gmail-folders:'.$hash, 90)->get(function () use ($settings, $hash): int {
            $client = new GmailImapClient($settings);
            try {
                $folders = $this->mailbox->folders($client);
                $emails = EmailDelivery::query()->whereNotNull('message_id')
                    ->whereIn('status', [EmailDeliveryStatus::SENT->value, EmailDeliveryStatus::BOUNCED->value,
                        EmailDeliveryStatus::RECEIVED->value, EmailDeliveryStatus::UNCONFIRMED->value])
                    ->where(fn ($query) => $query->whereNull('gmail_account_hash')->orWhere('gmail_account_hash', $hash))
                    ->orderBy('gmail_synced_at')->orderBy('created_at')->orderBy('id')
                    ->limit(max(1, (int) config('email_inbox.folder_batch_size', 20)))->get();
                $count = 0;
                $deadline = microtime(true) + 30;
                foreach ($emails as $email) {
                    if (microtime(true) >= $deadline) {
                        break;
                    }
                    $recordHash = $email->gmail_account_hash ?? ($email->payload['account_hash'] ?? null);
                    if ($recordHash !== null && ! hash_equals($hash, $recordHash)) {
                        $email->update(['gmail_synced_at' => now()]);

                        continue;
                    }
                    $message = $this->mailbox->find($client, $email, $folders);
                    if ($message !== null) {
                        $this->record->execute($email, $message, $hash);
                        $count++;
                    } else {
                        // Não remover histórico quando uma mensagem não existe mais no Gmail.
                        $email->update(['gmail_synced_at' => now()]);
                    }
                }

                return $count;
            } finally {
                $client->close();
            }
        });

        return $count === false ? null : $count;
    }
}
