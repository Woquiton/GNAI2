<?php

declare(strict_types=1);

namespace App\Domains\Infrastructure\Eloquent\Audit;

use App\Domains\Application\Actions\Audit\RecordAuditFieldChangeAction;
use App\Domains\Infrastructure\Observers\Audit\AuditObserver;
use Illuminate\Database\Eloquent\Model;

/**
 * Liga o model ao AuditObserver. Usada com a interface Auditable. Escritas que não disparam eventos do
 * Eloquent (pivôs com `sync()`, `query()->update()`, `insert`) precisam chamar `recordAuditFieldChange()`.
 *
 * @mixin Model
 */
trait AuditsChanges
{
    /** @var array<string, mixed>|null valores dos pivôs lidos antes da exclusão (a cascata os apaga) */
    private ?array $auditDeletionSnapshot = null;

    public static function bootAuditsChanges(): void
    {
        static::observe(AuditObserver::class);
    }

    /** @return list<string> */
    public static function unauditedFields(): array
    {
        return [];
    }

    /** @return array<string, mixed> */
    public function auditExtraValues(): array
    {
        return [];
    }

    /** Lê os valores adicionais antes do DELETE, enquanto os pivôs ainda existem. */
    public function snapshotAuditExtraValues(): void
    {
        $this->auditDeletionSnapshot = $this->auditExtraValues();
    }

    /** @return array<string, mixed> */
    public function auditExtraValuesForDeletion(): array
    {
        return $this->auditDeletionSnapshot ?? $this->auditExtraValues();
    }

    /** Registra a mudança de um campo fora dos eventos do Eloquent; funde com o registro da operação. */
    public function recordAuditFieldChange(string $field, mixed $before, mixed $after): void
    {
        app(RecordAuditFieldChangeAction::class)->execute($this, $field, $before, $after);
    }
}
