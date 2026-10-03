<?php

namespace App\Enums\SpecializedEducationalSupport;

use App\Enums\HasEnumHelper;

enum AttendanceLocation: string
{
    use HasEnumHelper;

    case SRM = 'srm';
    case COMMON_CLASSROOM = 'common_classroom';
    case ACCESSIBILITY_CENTER = 'accessibility_center';
    case OTHER = 'other';

    public function label(): string
    {
        return match ($this) {
            self::SRM => 'Sala de Recursos Multifuncionais (SRM)',
            self::COMMON_CLASSROOM => 'Sala Comum',
            self::ACCESSIBILITY_CENTER => 'Núcleo de Acessibilidade',
            self::OTHER => 'Outro',
        };
    }
}
