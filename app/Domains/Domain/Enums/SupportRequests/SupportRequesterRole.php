<?php

declare(strict_types=1);

namespace App\Domains\Domain\Enums\SupportRequests;

enum SupportRequesterRole: string
{
    case STUDENT = 'student';
    case GUARDIAN = 'guardian';
    case TEACHER = 'teacher';
    case COURSE_COORDINATION = 'course_coordination';
    case AEE_TEACHER = 'aee_teacher';
    case PSYCHOLOGY = 'psychology';
    case STUDENT_ASSISTANCE = 'student_assistance';
    case OTHER = 'other';

    public function label(): string
    {
        return match ($this) {
            self::STUDENT => 'Estudante',
            self::GUARDIAN => 'Familiar ou responsável',
            self::TEACHER => 'Docente',
            self::COURSE_COORDINATION => 'Coordenação de curso',
            self::AEE_TEACHER => 'Docente do AEE',
            self::PSYCHOLOGY => 'Psicologia',
            self::STUDENT_ASSISTANCE => 'Assistência estudantil',
            self::OTHER => 'Outro',
        };
    }
}
