<?php

declare(strict_types=1);

namespace App\Domains\Domain\Enums\Settings;

enum BackupRetentionMode: string
{
    case COUNT = 'count';
    case DAYS = 'days';

    public function label(): string
    {
        return match ($this) {
            self::COUNT => 'Manter os backups mais recentes (quantidade)',
            self::DAYS => 'Manter backups por um período (dias)',
        };
    }
}
