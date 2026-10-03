<?php

namespace App\Enums\SpecializedEducationalSupport;

use App\Enums\HasEnumHelper;

enum PaeeStatus: string
{
    use HasEnumHelper;

    case DRAFT = 'draft';
    case ACTIVE = 'active';
    case UNDER_REVIEW = 'under_review';

    public function label(): string
    {
        return match ($this) {
            self::DRAFT => 'Rascunho',
            self::ACTIVE => 'Ativo',
            self::UNDER_REVIEW => 'Em Revisão',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::DRAFT => 'secondary',
            self::ACTIVE => 'success',
            self::UNDER_REVIEW => 'warning',
        };
    }
}
