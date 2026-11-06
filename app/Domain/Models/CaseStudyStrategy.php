<?php

declare(strict_types=1);

namespace App\Domain\Models;

use App\Domains\Audit\Domain\Contracts\Auditable;
use App\Domains\Audit\Domain\ValueObjects\AuditedField;
use App\Domains\Audit\Infrastructure\Eloquent\AuditsChanges;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class CaseStudyStrategy extends Model implements Auditable
{
    use AuditsChanges;

    protected $table = 'case_study_strategies';

    protected $fillable = [
        'case_study_id',
        'linked_barrier_id',
        'description',
    ];

    public static function auditType(): string
    {
        return 'case_study_strategy';
    }

    public static function auditLabel(): string
    {
        return 'Estratégia do Estudo de Caso';
    }

    public static function auditedFields(): array
    {
        return [
            'case_study_id' => AuditedField::number('ID do Estudo de Caso'),
            'linked_barrier_id' => AuditedField::number('ID da barreira vinculada'),
            'description' => AuditedField::text('Descrição da estratégia'),
        ];
    }

    public function auditDescription(): string
    {
        return "a estratégia #{$this->getKey()} do Estudo de Caso #{$this->case_study_id}";
    }

    public function caseStudy(): BelongsTo
    {
        return $this->belongsTo(CaseStudy::class);
    }

    public function linkedBarrier(): BelongsTo
    {
        return $this->belongsTo(CaseStudyBarrier::class, 'linked_barrier_id');
    }
}
