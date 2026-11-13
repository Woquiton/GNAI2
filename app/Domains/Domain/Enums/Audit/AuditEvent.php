<?php

declare(strict_types=1);

namespace App\Domains\Domain\Enums\Audit;

enum AuditEvent: string
{
    case CREATED = 'created';
    case UPDATED = 'updated';
    case DELETED = 'deleted';
    case RESTORED = 'restored';
    case LOGIN = 'login';
    case LOGOUT = 'logout';
    case SESSION_UNLOCKED = 'session_unlocked';
    case INSPECTED = 'inspected';
    case INSPECTION_ENDED = 'inspection_ended';
    case ACCESSED = 'accessed';
    case PROCESSED = 'processed';

    public function label(): string
    {
        return match ($this) {
            self::CREATED => 'Criação',
            self::UPDATED => 'Alteração',
            self::DELETED => 'Exclusão',
            self::RESTORED => 'Restauração',
            self::LOGIN => 'Entrada',
            self::LOGOUT => 'Saída',
            self::SESSION_UNLOCKED => 'Desbloqueio de sessão',
            self::INSPECTED => 'Inspeção',
            self::INSPECTION_ENDED => 'Fim da inspeção',
            self::ACCESSED => 'Consulta em inspeção',
            self::PROCESSED => 'Operação processada',
        };
    }

    /** O verbo da frase em linguagem simples: "Maria alterou o aluno João". */
    public function verb(): string
    {
        return match ($this) {
            self::CREATED => 'criou',
            self::UPDATED => 'alterou',
            self::DELETED => 'excluiu',
            self::RESTORED => 'restaurou',
            self::LOGIN => 'entrou em',
            self::LOGOUT => 'saiu de',
            self::SESSION_UNLOCKED => 'desbloqueou',
            self::INSPECTED => 'inspecionou',
            self::INSPECTION_ENDED => 'encerrou a inspeção de',
            self::ACCESSED => 'consultou',
            self::PROCESSED => 'processou',
        };
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    public static function options(): array
    {
        return array_map(
            fn (self $event): array => ['value' => $event->value, 'label' => $event->label()],
            self::cases(),
        );
    }
}
