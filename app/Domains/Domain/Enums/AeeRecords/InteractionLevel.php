<?php

declare(strict_types=1);

namespace App\Domains\Domain\Enums\AeeRecords;

enum InteractionLevel: string
{
    case VERY_LOW = 'very_low';
    case LOW = 'low';
    case MODERATE = 'moderate';
    case GOOD = 'good';

    public function label(): string
    {
        return match ($this) {
            self::VERY_LOW => 'Muito Baixo',
            self::LOW => 'Baixo',
            self::MODERATE => 'Moderado',
            self::GOOD => 'Bom',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::VERY_LOW,
            self::LOW => 'danger',
            self::MODERATE => 'warning',
            self::GOOD => 'success',
        };
    }
}
