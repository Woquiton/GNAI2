<?php

declare(strict_types=1);

namespace App\Domains\Domain\Enums\Tags;

enum TagModule: string
{
    case PUBLICATIONS = 'publications';
    case INBOX = 'inbox';

    public function label(): string
    {
        return match ($this) {
            self::PUBLICATIONS => 'Publicações',
            self::INBOX => 'Inbox',
        };
    }

    public static function options(): array
    {
        return collect(self::cases())->mapWithKeys(fn (self $module) => [$module->value => $module->label()])->all();
    }
}
