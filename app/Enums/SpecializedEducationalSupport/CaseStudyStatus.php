<?php

namespace App\Enums\SpecializedEducationalSupport;

use App\Enums\HasEnumHelper;

enum CaseStudyStatus: string
{
    use HasEnumHelper;

    case DRAFT = 'draft';
    case IN_PROGRESS = 'in_progress';
    case COMPLETED = 'completed';

    public function label(): string
    {
        return match ($this) {
            self::DRAFT => 'Rascunho',
            self::IN_PROGRESS => 'Em Andamento',
            self::COMPLETED => 'Concluído',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::DRAFT => 'secondary',
            self::IN_PROGRESS => 'warning',
            self::COMPLETED => 'success',
        };
    }
}
