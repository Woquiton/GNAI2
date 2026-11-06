<?php

declare(strict_types=1);

namespace App\Domain\Models;

use App\Domains\Audit\Domain\Contracts\Auditable;
use App\Domains\Audit\Domain\ValueObjects\AuditedField;
use App\Domains\Audit\Infrastructure\Eloquent\AuditsChanges;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class CaseStudyBarrier extends Model implements Auditable
{
    use AuditsChanges;

    protected $table = 'case_study_barriers';

    protected $fillable = [
        'case_study_id',
        'type',
        'observed_situation',
        'participation_implication',
    ];

    public static function auditType(): string
    {
        return 'case_study_barrier';
    }

    public static function auditLabel(): string
    {
        return 'Barreira do Estudo de Caso';
    }

    public static function auditedFields(): array
    {
        return [
            'case_study_id' => AuditedField::number('ID do Estudo de Caso'),
            // Guarda o nome da categoria como retrato histórico.
            'type' => AuditedField::text('Categoria de barreira'),
            'observed_situation' => AuditedField::text('Situação observada'),
            'participation_implication' => AuditedField::text('Implicação na participação'),
        ];
    }

    public function auditDescription(): string
    {
        return "a barreira #{$this->getKey()} do Estudo de Caso #{$this->case_study_id}";
    }

    public function caseStudy(): BelongsTo
    {
        return $this->belongsTo(CaseStudy::class);
    }
}
