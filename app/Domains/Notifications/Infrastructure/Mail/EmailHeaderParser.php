<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Infrastructure\Mail;

final readonly class EmailHeaderParser
{
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

    public function decode(string $value): string
    {
        if ($value === '') {
            return '';
        }
        $decoded = '';
        foreach (imap_mime_header_decode($value) ?: [] as $piece) {
            $decoded .= $this->utf8($piece->text, $piece->charset);
        }

        return $decoded;
    }

    public function utf8(string $value, string $charset): string
    {
        try {
            return mb_convert_encoding($value, 'UTF-8', strtolower($charset) === 'default' ? 'UTF-8' : $charset);
        } catch (\ValueError) {
            return mb_convert_encoding($value, 'UTF-8', 'UTF-8');
        }
    }

    /** @return list<array{address: string, name: string}> */
    public function addresses(string $value): array
    {
        if (trim($value) === '') {
            return [];
        }
        $addresses = [];
        foreach (imap_rfc822_parse_adrlist($value, 'invalid') ?: [] as $address) {
            $email = ($address->mailbox ?? '').'@'.($address->host ?? '');
            if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $addresses[] = ['address' => $email, 'name' => $this->decode($address->personal ?? '')];
            }
        }

        return array_slice($addresses, 0, 100);
    }

    /** @return list<string> */
    public function messageIds(string $value): array
    {
        preg_match_all('/<([^<>\s]+@[^<>\s]+)>/', $value, $matches);

        return array_slice(array_values(array_unique($matches[1] ?? [])), 0, 50);
    }
}
