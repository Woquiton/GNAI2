<?php

namespace App\Enums\SpecializedEducationalSupport;

use App\Enums\HasEnumHelper;

enum ObjectiveTerm: string
{
    use HasEnumHelper;

    case SHORT = 'short';
    case MEDIUM = 'medium';
    case LONG = 'long';

    public function label(): string
    {
        return match ($this) {
            self::SHORT => 'Curto Prazo',
            self::MEDIUM => 'Médio Prazo',
            self::LONG => 'Longo Prazo',
        };
    }
}
