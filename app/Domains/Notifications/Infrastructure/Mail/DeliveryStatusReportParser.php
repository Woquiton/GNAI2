<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Infrastructure\Mail;

use App\Domains\Notifications\Domain\DTOs\EmailBounceDTO;

/** Interpreta somente os campos estruturados do DSN, nunca o texto humano do aviso. */
final class DeliveryStatusReportParser
{
    /** @return list<EmailBounceDTO> */
    public function parse(string $report, string $originalHeaders): array
    {
        $headers = $this->fields($originalHeaders);
        if (! preg_match('/^<([^<>\s]+@[^<>\s]+)>$/D', $headers['message-id'] ?? '', $match)) {
            return [];
        }
        $messageId = $match[1];
        $bounces = [];
        $blocks = preg_split('/\n\s*\n/', str_replace("\r\n", "\n", $report)) ?: [];
        foreach ($blocks as $block) {
            $fields = $this->fields($block);
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

    /** @return array<string, string> */
    public function fields(string $headers): array
    {
        $headers = preg_replace('/\r?\n[\t ]+/', ' ', $headers) ?? '';
        $fields = [];
        foreach (explode("\n", str_replace("\r\n", "\n", $headers)) as $line) {
            if ($line === '') {
                break;
            }
            if (preg_match('/^([A-Za-z0-9-]+):\s*(.*)$/D', $line, $match)) {
                $fields[strtolower($match[1])] = trim($match[2]);
            }
        }

        return $fields;
    }
}
