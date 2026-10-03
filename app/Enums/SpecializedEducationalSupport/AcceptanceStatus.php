<?php

namespace App\Enums\SpecializedEducationalSupport;

use App\Enums\HasEnumHelper;

enum AcceptanceStatus: string
{
    use HasEnumHelper;

    case ACCEPTED = 'accepted';
    case DECLINED = 'declined';
    case NOT_APPLICABLE = 'not_applicable';

    public function label(): string
    {
        return match ($this) {
            self::ACCEPTED => 'Aceito',
            self::DECLINED => 'Recusado',
            self::NOT_APPLICABLE => 'Não se Aplica',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::ACCEPTED => 'success',
            self::DECLINED => 'danger',
            self::NOT_APPLICABLE => 'secondary',
        };
    }
}
