<?php

declare(strict_types=1);

namespace App\Domains\Domain\ValueObjects\Notifications;

final readonly class EmailRecipients
{
    /** @return list<string> */
    public static function parse(string $value): array
    {
        return array_values(array_unique(array_filter(array_map(
            static fn (string $email): string => trim($email),
            preg_split('/[,;\r\n]+/', $value) ?: [],
        ))));
    }
}
