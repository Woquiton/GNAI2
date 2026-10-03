<?php

namespace App\Enums\SpecializedEducationalSupport;

use App\Enums\HasEnumHelper;

enum DemandOrigin: string
{
    use HasEnumHelper;

    case TEACHER = 'teacher';
    case FAMILY = 'family';
    case STUDENT = 'student';
    case MEDICAL_REPORT = 'medical_report';
    case OTHER = 'other';

    public function label(): string
    {
        return match ($this) {
            self::TEACHER => 'Professor(a)',
            self::FAMILY => 'Família',
            self::STUDENT => 'Estudante',
            self::MEDICAL_REPORT => 'Laudo Médico',
            self::OTHER => 'Outro',
        };
    }
}
