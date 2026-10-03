<?php

namespace App\Enums\SpecializedEducationalSupport;

use App\Enums\HasEnumHelper;

enum BarrierType: string
{
    use HasEnumHelper;

    case ARCHITECTURAL = 'architectural';
    case URBANISTIC = 'urbanistic';
    case TRANSPORT = 'transport';
    case COMMUNICATIONAL = 'communicational';
    case METHODOLOGICAL = 'methodological';
    case TECHNOLOGICAL = 'technological';
    case ATTITUDINAL = 'attitudinal';
    case SOCIAL = 'social';

    public function label(): string
    {
        return match ($this) {
            self::ARCHITECTURAL => 'Arquitetônica',
            self::URBANISTIC => 'Urbanística',
            self::TRANSPORT => 'Nos Transportes',
            self::COMMUNICATIONAL => 'Comunicacional',
            self::METHODOLOGICAL => 'Metodológica',
            self::TECHNOLOGICAL => 'Tecnológica',
            self::ATTITUDINAL => 'Atitudinal',
            self::SOCIAL => 'Social',
        };
    }
}
