<?php

declare(strict_types=1);

namespace App\Domain\Models;

use App\Domains\Audit\Domain\Contracts\Auditable;
use App\Domains\Audit\Domain\ValueObjects\AuditedField;
use App\Domains\Audit\Infrastructure\Eloquent\AuditsChanges;
use App\Shared\Domain\Support\AeeLabels;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class PaeeObjective extends Model implements Auditable
{
    use AuditsChanges;

    protected $table = 'paee_objectives';

    protected $fillable = [
        'paee_id',
        'linked_barrier_id',
        'description',
        'term',
    ];

    public static function auditType(): string
    {
        return 'paee_objective';
    }

    public static function auditLabel(): string
    {
        return 'Objetivo do PAEE';
    }

    public static function auditedFields(): array
    {
        return [
            'paee_id' => AuditedField::number('ID do PAEE'),
            'linked_barrier_id' => AuditedField::number('ID da barreira vinculada'),
            'description' => AuditedField::text('Descrição'),
            'term' => AuditedField::enum('Prazo', valueLabels: AeeLabels::OBJECTIVE_TERMS),
        ];
    }

    public function auditDescription(): string
    {
        return "o objetivo #{$this->getKey()} do PAEE #{$this->paee_id}";
    }

    public function paee(): BelongsTo
    {
        return $this->belongsTo(Paee::class);
    }

    public function linkedBarrier(): BelongsTo
    {
        return $this->belongsTo(CaseStudyBarrier::class, 'linked_barrier_id');
    }
}
