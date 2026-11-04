<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Application\Actions\Email;

use App\Domains\Notifications\Application\Queries\Email\FindEmailReplyParentQuery;
use App\Domains\Notifications\Domain\Enums\EmailDeliveryContext;
use App\Domains\Notifications\Domain\Enums\EmailDeliveryStatus;
use App\Domains\Notifications\Domain\Enums\EmailPurpose;
use App\Domains\Notifications\Domain\Models\EmailDelivery;
use App\Domains\Notifications\Infrastructure\Mail\EmailAttachmentStorage;
use App\Domains\Notifications\Infrastructure\Mail\EmailHeaderParser;
use App\Domains\Notifications\Infrastructure\Mail\GmailMessageReader;
use IMAP\Connection;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Str;
use Throwable;

final readonly class ImportGmailReplyAction
{
    public function __construct(
        private EmailHeaderParser $headers,
        private GmailMessageReader $reader,
        private EmailAttachmentStorage $attachments,
        private FindEmailReplyParentQuery $parent,
    ) {}

    public function execute(
        Connection $connection,
        int $uid,
        array $headers,
        string $accountHash,
        string $fallbackKey,
        float $deadline,
    ): bool {
        if (stripos($headers['content-type'] ?? '', 'multipart/report') !== false) {
            return false;
        }
        $ids = [...$this->headers->messageIds($headers['in-reply-to'] ?? ''),
            ...array_reverse($this->headers->messageIds($headers['references'] ?? ''))];
        $parent = $this->parent->execute($ids);
        if ($parent === null) {
            return false;
        }
        $sender = $this->headers->addresses($headers['from'] ?? '')[0] ?? null;
        if ($sender === null) {
            return false;
        }
        $messageId = $this->headers->messageIds($headers['message-id'] ?? '')[0] ?? null;
        $key = hash('sha256', 'gmail-reply:'.$accountHash.':'.($messageId ?? $fallbackKey));
        if (EmailDelivery::query()->where('deduplication_key', $key)->exists()) {
            return false;
        }
        $email = new EmailDelivery;
        $email->id = (string) Str::uuid();
        $content = $this->reader->read($connection, $uid, $email->id, $deadline);
        try {
            $to = array_column($this->headers->addresses($headers['to'] ?? ''), 'address');
            $email->fill([
                'deduplication_key' => $key,
                'context_type' => EmailDeliveryContext::MAILBOX->value, 'context_id' => 0, 'purpose' => EmailPurpose::INCOMING->value,
                'recipient_email' => $to[0] ?? null, 'recipient_name' => null,
                'subject' => mb_substr($this->headers->decode($headers['subject'] ?? ''), 0, 255),
                'view' => 'emails.notifications.composed', 'text_view' => 'emails.notifications.composed-text',
                'status' => EmailDeliveryStatus::RECEIVED,
                'in_reply_to_id' => $parent->id,
                'message_id' => $messageId !== null && strlen($messageId) <= 255 ? $messageId : null,
                'received_at' => now(),
                'gmail_account_hash' => $accountHash,
                'payload' => [
                    'sender_address' => $sender['address'], 'sender_name' => $sender['name'],
                    'reply_to' => array_column($this->headers->addresses($headers['reply-to'] ?? ''), 'address'),
                    'to' => $to, 'cc' => array_column($this->headers->addresses($headers['cc'] ?? ''), 'address'),
                    'body' => $content->html, 'attachments' => $content->attachments, 'notices' => $content->notices,
                    'account_hash' => $accountHash,
                ],
            ]);
            $email->saveOrFail();

            return true;
        } catch (UniqueConstraintViolationException $exception) {
            $this->attachments->delete($content->attachments);
            if (EmailDelivery::query()->where('deduplication_key', $key)->exists()) {
                return false;
            }

            throw $exception;
        } catch (Throwable $exception) {
            $this->attachments->delete($content->attachments);

            throw $exception;
        }
    }
}
