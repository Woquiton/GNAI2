<?php

declare(strict_types=1);

namespace App\Domains\Domain\Models\AeeRecords;

use App\Domains\Domain\DTOs\AeeRecords\AeeStudentEvaluationDTO;
use App\Domains\Domain\Contracts\Audit\Auditable;
use App\Domains\Domain\ValueObjects\Audit\AuditedField;
use App\Domains\Infrastructure\Eloquent\Audit\AuditsChanges;
use App\Domains\Domain\Models\Guardians\Guardian;
use App\Domains\Domain\Models\Students\Student;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

final class AeeStudentEvaluation extends Model implements Auditable
{
    use AuditsChanges;
    use SoftDeletes;

    protected $table = 'aee_student_evaluations';

    protected $fillable = [
        'aee_record_id',
        'student_id',
        'is_present',
        'with_guardians',
        'absence_reason',
        'adaptations_made',
        'student_participation',
        'development_evaluation',
        'progress_indicators',
        'recommendations',
        'next_session_adjustments',
    ];

    protected $casts = [
        'is_present' => 'boolean',
        'with_guardians' => 'boolean',
    ];

    public static function auditType(): string
    {
        return 'aee_student_evaluation';
    }

    public static function auditLabel(): string
    {
        return 'Avaliação Individual AEE';
    }

    public static function auditedFields(): array
    {
        return [
            // O nome do aluno mora em `people`; o histórico guarda os vínculos pelo id.
            'aee_record_id' => AuditedField::number('ID do atendimento AEE'),
            'student_id' => AuditedField::reference('Aluno', Student::class, 'person.name'),
            'is_present' => AuditedField::boolean('Aluno presente'),
            'with_guardians' => AuditedField::boolean('Atendimento realizado com responsável pelo aluno'),
            'guardians' => AuditedField::list('Responsáveis participantes', model: Guardian::class, nameColumn: 'person.name'),
            'absence_reason' => AuditedField::text('Motivo da ausência'),
            'adaptations_made' => AuditedField::text('Adaptações para este aluno'),
            'student_participation' => AuditedField::text('Participação'),
            'development_evaluation' => AuditedField::text('Avaliação do desenvolvimento'),
            'progress_indicators' => AuditedField::text('Indicadores de progresso'),
            'recommendations' => AuditedField::text('Recomendações'),
            'next_session_adjustments' => AuditedField::text('Ajustes para o próximo atendimento AEE'),
        ];
    }

    public function auditDescription(): string
    {
        $studentName = $this->student?->person?->name;

        return $studentName !== null
            ? "a avaliação AEE #{$this->getKey()} de {$studentName}"
            : "a avaliação AEE #{$this->getKey()}";
    }

    /** @return array<string, mixed> */
    public function auditExtraValues(): array
    {
        return $this->exists ? ['guardians' => $this->guardianIds()] : [];
    }

    public static function register(AeeRecord $aeeRecord, Student $student, AeeStudentEvaluationDTO $data): self
    {
        return new self([
            'aee_record_id' => $aeeRecord->getKey(),
            'student_id' => $student->getKey(),
            ...self::attributesFrom($data),
        ]);
    }

    public function revise(AeeStudentEvaluationDTO $data): void
    {
        $this->fill(self::attributesFrom($data));
    }

    public function aeeRecord(): BelongsTo
    {
        return $this->belongsTo(AeeRecord::class, 'aee_record_id');
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

    public function scopeOfStudent(Builder $query, int $studentId): Builder
    {
        return $query->where('student_id', $studentId);
    }

    public function guardians(): BelongsToMany
    {
        return $this->belongsToMany(
            Guardian::class,
            'aee_student_evaluation_guardians',
            'aee_student_evaluation_id',
            'guardian_id',
        )->withTimestamps();
    }

    /** @param list<int> $guardianIds */
    public function syncGuardians(array $guardianIds): void
    {
        $before = $this->guardianIds();
        $this->guardians()->sync(array_values(array_unique($guardianIds)));
        $this->recordAuditFieldChange('guardians', $before, $this->guardianIds());
    }

    /** @return list<int> */
    private function guardianIds(): array
    {
        return $this->guardians()->pluck('student_guardians.id')->map(fn (mixed $id): int => (int) $id)->all();
    }

    private static function attributesFrom(AeeStudentEvaluationDTO $data): array
    {
        return [
            'is_present' => $data->isPresent,
            'with_guardians' => $data->isPresent && $data->withGuardians,
            'absence_reason' => $data->isPresent ? null : self::nullableText($data->absenceReason),
            'adaptations_made' => $data->isPresent ? self::nullableText($data->adaptationsMade) : null,
            'student_participation' => $data->isPresent ? self::nullableText($data->studentParticipation) : null,
            'development_evaluation' => $data->isPresent ? self::nullableText($data->developmentEvaluation) : null,
            'progress_indicators' => $data->isPresent ? self::nullableText($data->progressIndicators) : null,
            'recommendations' => $data->isPresent ? self::nullableText($data->recommendations) : null,
            'next_session_adjustments' => $data->isPresent ? self::nullableText($data->nextSessionAdjustments) : null,
        ];
    }

    private static function nullableText(?string $value): ?string
    {
        $value = trim((string) $value);

        return $value === '' ? null : $value;
    }
}
