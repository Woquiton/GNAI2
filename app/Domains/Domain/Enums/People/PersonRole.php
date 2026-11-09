<?php

declare(strict_types=1);

namespace App\Domains\Domain\Enums\People;

enum PersonRole: string
{
    case STUDENT = 'student';
    case TEACHER = 'teacher';
    case PROFESSIONAL = 'professional';
    case GUARDIAN = 'guardian';

    public function label(): string
    {
        return match ($this) {
            self::STUDENT => 'Aluno',
            self::TEACHER => 'Professor',
            self::PROFESSIONAL => 'Equipe',
            self::GUARDIAN => 'Responsáveis',
        };
    }

    public function relationName(): string
    {
        return $this === self::GUARDIAN ? 'guardians' : $this->value;
    }
}
