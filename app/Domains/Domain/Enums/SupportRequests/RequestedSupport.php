<?php

declare(strict_types=1);

namespace App\Domains\Domain\Enums\SupportRequests;

enum RequestedSupport: string
{
    case TEACHER_GUIDANCE = 'teacher_guidance';
    case PEDAGOGICAL_SUPPORT = 'pedagogical_support';
    case AEE = 'aee';
    case PSYCHOLOGY = 'psychology';
    case PEDAGOGICAL_ADAPTATIONS = 'pedagogical_adaptations';
    case ASSESSMENT_ADAPTATIONS = 'assessment_adaptations';
    case ORGANIZATIONAL_ADJUSTMENTS = 'organizational_adjustments';
    case OTHER = 'other';

    public function label(): string
    {
        return match ($this) {
            self::TEACHER_GUIDANCE => 'Orientações aos docentes',
            self::PEDAGOGICAL_SUPPORT => 'Acompanhamento pedagógico pelo núcleo',
            self::AEE => 'Encaminhamento ao AEE',
            self::PSYCHOLOGY => 'Encaminhamento à psicologia',
            self::PEDAGOGICAL_ADAPTATIONS => 'Adaptações pedagógicas',
            self::ASSESSMENT_ADAPTATIONS => 'Adaptações avaliativas',
            self::ORGANIZATIONAL_ADJUSTMENTS => 'Adequações físicas ou organizacionais',
            self::OTHER => 'Outro',
        };
    }
}
