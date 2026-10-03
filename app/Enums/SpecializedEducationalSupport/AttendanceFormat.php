<?php

namespace App\Enums\SpecializedEducationalSupport;

use App\Enums\HasEnumHelper;

enum AttendanceFormat: string
{
    use HasEnumHelper;

    case INDIVIDUAL = 'individual';
    case COLLECTIVE = 'collective';
    case MIXED = 'mixed';

    public function label(): string
    {
        return match ($this) {
            self::INDIVIDUAL => 'Individual',
            self::COLLECTIVE => 'Coletivo',
            self::MIXED => 'Misto',
        };
    }
}
