<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Audit;

use App\Domains\Domain\Contracts\Audit\Auditable;
use App\Domains\Domain\Enums\Audit\AuditEvent;
use App\Domains\Domain\ValueObjects\Audit\AuditChanges;
use Illuminate\Database\Eloquent\Model;

/**
 * Registra a mudança de um campo que não passa pelos eventos do Eloquent: pivôs (permissões do cargo,
 * disciplinas do curso) e escritas em massa. Funde com o registro da mesma entidade na operação: "criou o
 * cargo X" já traz as permissões.
 */
final class RecordAuditFieldChangeAction
{
    public function __construct(private readonly RecordAuditChangeAction $record) {}

    public function execute(Model&Auditable $entity, string $field, mixed $before, mixed $after): void
    {
        $this->record->execute(
            $entity,
            AuditEvent::UPDATED,
            AuditChanges::forField($entity, $field, $before, $after),
        );
    }
}
