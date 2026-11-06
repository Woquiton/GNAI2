<?php

declare(strict_types=1);

namespace App\Domain\Enums;

enum StudentStatus: string
{
    case ACTIVE = 'active';
    case INTAKE = 'intake';
    case LOCKED = 'locked';
    case COMPLETED = 'completed';
    case DROPPED = 'dropped';

    public function label(): string
    {
        return match ($this) {
            self::ACTIVE => 'Ativo',
            self::INTAKE => 'Em acolhimento',
            self::LOCKED => 'Trancado',
            self::COMPLETED => 'Concluído',
            self::DROPPED => 'Desistente',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::ACTIVE => 'success',
            self::INTAKE => 'info',
            self::LOCKED => 'warning',
            self::COMPLETED => 'primary',
            self::DROPPED => 'danger',
        };
    }

    public function isEnabled(): bool
    {
        return $this === self::ACTIVE;
    }
}
