<?php

declare(strict_types=1);

namespace App\Domain\Enums;

enum SupportDiagnosisStatus: string
{
    case NOT_INFORMED = 'not_informed';
    case CONFIRMED = 'confirmed';
    case INVESTIGATION = 'investigation';
    case NONE = 'none';

    public function label(): string
    {
        return match ($this) {
            self::NOT_INFORMED => 'Não informado',
            self::CONFIRMED => 'Diagnóstico concluído',
            self::INVESTIGATION => 'Investigação em andamento',
            self::NONE => 'Sem diagnóstico',
        };
    }
}
