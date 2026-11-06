<?php

declare(strict_types=1);

namespace App\Domains\Domain\Enums\Settings;

enum PdfLogoShape: string
{
    case SQUARE = 'square';
    case ROUNDED = 'rounded';
    case CIRCLE = 'circle';

    public function label(): string
    {
        return match ($this) {
            self::SQUARE => 'Quadrada',
            self::ROUNDED => 'Cantos arredondados',
            self::CIRCLE => 'Redonda',
        };
    }
}
