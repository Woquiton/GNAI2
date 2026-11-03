<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Domain\Enums;

/**
 * Como o agendamento surgiu: pelo módulo de agendamentos ou criado junto do registro direto de
 * um atendimento já realizado, sem agendamento prévio.
 */
enum SessionOrigin: string
{
    case SCHEDULING = 'scheduling';
    case DIRECT_RECORD = 'direct_record';

    public function label(): string
    {
        return match ($this) {
            self::SCHEDULING => 'Agendamento',
            self::DIRECT_RECORD => 'Registro direto do atendimento',
        };
    }

    /** @return array<string, string> */
    public static function options(): array
    {
        return [
            self::SCHEDULING->value => self::SCHEDULING->label(),
            self::DIRECT_RECORD->value => self::DIRECT_RECORD->label(),
        ];
    }
}
