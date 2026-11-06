<?php

declare(strict_types=1);

namespace App\Domains\Domain\Enums\SupportRequests;

enum SupportRequestReasonType: string
{
    case PROFILE = 'profile';
    case OTHER = 'other';

    public function label(): string
    {
        return match ($this) {
            self::PROFILE => 'Perfil de atendimento',
            self::OTHER => 'Outro',
        };
    }
}
