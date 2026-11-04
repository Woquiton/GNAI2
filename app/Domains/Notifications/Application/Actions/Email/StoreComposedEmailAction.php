<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Application\Actions\Email;

use App\Domains\Notifications\Application\Data\Email\ComposeEmailData;
use App\Domains\Notifications\Application\Handlers\Email\ComposeEmailAttachmentsHandler;
use App\Domains\Notifications\Application\Policies\EmailMailboxAccessPolicy;
use App\Domains\Notifications\Domain\Enums\EmailDeliveryContext;
use App\Domains\Notifications\Domain\Enums\EmailDeliveryStatus;
use App\Domains\Notifications\Domain\Enums\EmailPurpose;
use App\Domains\Notifications\Domain\Models\EmailDelivery;
use App\Domains\Notifications\Domain\Models\EmailMailboxState;
use App\Domains\Notifications\Domain\ValueObjects\EmailRecipients;
use App\Domains\Notifications\Infrastructure\Jobs\SendEmailDelivery;
use App\Domains\Notifications\Infrastructure\Mail\EmailAttachmentStorage;
use App\Shared\Infrastructure\Security\RichTextSanitizer;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

final readonly class StoreComposedEmailAction
{
    public function __construct(
        private EmailAttachmentStorage $attachments,
        private EmailMailboxAccessPolicy $access,
        private ComposeEmailAttachmentsHandler $prepareAttachments,
    ) {}

    public function execute(ComposeEmailData $data, int $userId): EmailDelivery
    {
        $sending = $data->intent === 'send';
        $inReplyTo = null;
        $forwardAttachments = [];
        if ($data->sourceId !== null) {
            $source = EmailDelivery::query()->findOrFail($data->sourceId);
            $this->access->ensureCanUseAsSource($source, $userId);
            $inReplyTo = $data->replyMode === 'reply' ? $source->message_id : null;
            if ($data->replyMode === 'forward' && in_array($source->purpose, [EmailPurpose::MANUAL->value, EmailPurpose::INCOMING->value], true)) {
                $forwardAttachments = $source->payload['attachments'] ?? [];
            }
        }
        $body = RichTextSanitizer::sanitize($data->body ?? '');
        $to = EmailRecipients::parse($data->to ?? '');
        $changes = null;
        $dispatch = false;
        try {
            $email = DB::transaction(function () use (
                $data, $userId, $to, $body, $sending, $inReplyTo, $forwardAttachments,
                &$changes, &$dispatch,
            ): EmailDelivery {
                $email = EmailDelivery::query()->firstOrCreate(
                    ['deduplication_key' => hash('sha256', 'manual:'.$userId.':'.$data->key)],
                    [
                        'context_type' => EmailDeliveryContext::MAILBOX->value, 'context_id' => $userId, 'purpose' => EmailPurpose::MANUAL->value,
                        'recipient_email' => null, 'recipient_name' => null,
                        'subject' => '', 'view' => 'emails.notifications.composed',
                        'text_view' => 'emails.notifications.composed-text',
                        'payload' => ['key' => $data->key], 'status' => EmailDeliveryStatus::DRAFT,
                    ],
                );
                $initializing = $email->wasRecentlyCreated;
                $email = EmailDelivery::query()->lockForUpdate()->findOrFail($email->id);
                if ($email->status !== EmailDeliveryStatus::DRAFT) {
                    // O mesmo formulário não pode criar outro envio após um duplo clique ou retry.
                    return $email;
                }
                $changes = $this->prepareAttachments->prepare($data, $email, $initializing, $forwardAttachments);
                $email->update([
                    'recipient_email' => $to[0] ?? null,
                    'subject' => $data->subject ?? '',
                    'in_reply_to_id' => $data->replyMode === 'reply' ? $data->sourceId : null,
                    'status' => $sending ? EmailDeliveryStatus::QUEUED : EmailDeliveryStatus::DRAFT,
                    'payload' => [
                        'key' => $data->key, 'to' => $to,
                        'subject' => $data->subject ?? '',
                        'source_id' => $data->sourceId, 'reply_mode' => $data->replyMode,
                        'in_reply_to' => $inReplyTo,
                        'cc' => EmailRecipients::parse($data->cc ?? ''),
                        'bcc' => EmailRecipients::parse($data->bcc ?? ''),
                        'body' => $body,
                        'attachments' => $changes->attachments,
                    ],
                ]);
                $dispatch = $sending;
                if ($sending) {
                    EmailMailboxState::query()->updateOrCreate(
                        ['email_delivery_id' => $email->id, 'user_id' => $userId],
                        ['folder' => null, 'is_read' => true],
                    );
                }

                return $email;
            });
        } catch (Throwable $exception) {
            $this->attachments->delete($changes?->created ?? []);

            throw $exception;
        }
        $this->attachments->delete($changes?->removed ?? []);
        if ($dispatch) {
            try {
                Bus::dispatch(new SendEmailDelivery($email->id));
            } catch (Throwable $exception) {
                $email->refresh();
                if ($email->status === EmailDeliveryStatus::QUEUED) {
                    $email->update(['status' => EmailDeliveryStatus::DRAFT, 'error_type' => $exception::class]);
                }
                Log::warning('Não foi possível iniciar o envio da mensagem escrita no sistema.', [
                    'email_delivery_id' => $email->id,
                    'error_type' => $exception::class,
                ]);
            }
        }

        return $email->refresh();
    }
}
