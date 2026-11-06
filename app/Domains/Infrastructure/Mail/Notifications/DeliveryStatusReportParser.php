<?php

declare(strict_types=1);

namespace App\Domains\Infrastructure\Mail\Notifications;

use App\Domains\Domain\DTOs\Notifications\EmailBounceDTO;

/** Interpreta somente os campos estruturados do DSN, nunca o texto humano do aviso. */
final readonly class DeliveryStatusReportParser
{
    public function __construct(private EmailHeaderParser $headers) {}

    /** @return list<EmailBounceDTO> */
    public function parse(string $report, string $originalHeaders): array
    {
        $headers = $this->headers->fields($originalHeaders);
        if (! preg_match('/^<([^<>\s]+@[^<>\s]+)>$/D', $headers['message-id'] ?? '', $match)) {
            return [];
        }
        $messageId = $match[1];
        $bounces = [];
        $blocks = preg_split('/\n\s*\n/', str_replace("\r\n", "\n", $report)) ?: [];
        foreach ($blocks as $block) {
            $fields = $this->headers->fields($block);
            $status = $fields['status'] ?? '';
            if (strtolower($fields['action'] ?? '') !== 'failed'
                || ! preg_match('/^5\.\d{1,3}\.\d{1,3}$/D', $status)) {
                continue;
            }
            $recipient = $fields['original-recipient'] ?? $fields['final-recipient'] ?? '';
            if (! preg_match('/^rfc822\s*;\s*(.+)$/iD', $recipient, $match)) {
                continue;
            }
            $email = trim($match[1]);
            if (filter_var($email, FILTER_VALIDATE_EMAIL) !== false) {
                $bounces[] = new EmailBounceDTO($messageId, $email, $status);
            }
        }

        return $bounces;
    }
}
