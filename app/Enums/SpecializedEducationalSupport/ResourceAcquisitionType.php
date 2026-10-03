<?php

namespace App\Enums\SpecializedEducationalSupport;

use App\Enums\HasEnumHelper;

enum ResourceAcquisitionType: string
{
    use HasEnumHelper;

    case TO_PRODUCE = 'to_produce';
    case TO_ACCESSIBILIZE = 'to_accessibilize';
    case TO_ACQUIRE = 'to_acquire';

    public function label(): string
    {
        return match ($this) {
            self::TO_PRODUCE => 'A Produzir',
            self::TO_ACCESSIBILIZE => 'A Acessibilizar',
            self::TO_ACQUIRE => 'A Adquirir',
        };
    }
}
