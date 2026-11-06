<?php

declare(strict_types=1);

namespace App\Domains\Domain\Models\CaseStudies;

use App\Domains\Domain\Contracts\Audit\Auditable;
use App\Domains\Domain\ValueObjects\Audit\AuditedField;
use App\Domains\Infrastructure\Eloquent\Audit\AuditsChanges;
use App\Domains\Domain\Models\Auth\User;
use App\Domains\Domain\DTOs\CaseStudies\CaseStudyDTO;
use App\Domains\Domain\Exceptions\CaseStudies\InvalidCaseStudy;
use App\Domains\Domain\Models\Paees\Paee;
use App\Domains\Domain\Models\Semesters\Semester;
use App\Domains\Domain\Models\Students\Student;
use App\Shared\Domain\Support\AeeLabels;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class CaseStudy extends Model implements Auditable
{
    use AuditsChanges;
    use HasFactory;

    public const STATUS_DRAFT = 'draft';

    public const STATUS_IN_PROGRESS = 'in_progress';

    public const STATUS_COMPLETED = 'completed';

    protected $table = 'case_studies';

    protected $fillable = [
        'student_id',
        'creator_id',
        'semester_id',
        'version',
        'is_current',
        'status',
        'demand_origin',
        'participants_summary',
        'study_date',
        'student_observation',
        'student_family_listening',
        'teachers_listening',
        'other_info',
        'care_network_notes',
        'favorable_aspects',
        'potentials_interests',
        'needed_supports',
        'needed_supports_justification',
        'acceptance_status',
        'acceptance_date',
        'completed_at',
    ];

    protected $casts = [
        'version' => 'integer',
        'is_current' => 'boolean',
        'needed_supports' => 'array',
        'study_date' => 'date',
        'acceptance_date' => 'date',
        'completed_at' => 'datetime',
    ];

    public static function auditType(): string
    {
        return 'case_study';
    }

    public static function auditLabel(): string
    {
        return 'Estudo de Caso';
    }

    public static function auditedFields(): array
    {
        return [
            // O nome do aluno mora em `people`; o histórico guarda os vínculos pelo id.
            'student_id' => AuditedField::reference('Aluno', Student::class, 'person.name'),
            'creator_id' => AuditedField::reference('Criado por', User::class),
            'semester_id' => AuditedField::reference('Semestre', Semester::class, 'label'),
            'version' => AuditedField::number('Versão'),
            'is_current' => AuditedField::boolean('Vigente'),
            'status' => AuditedField::enum('Status', valueLabels: AeeLabels::CASE_STUDY_STATUSES),
            'demand_origin' => AuditedField::enum('Origem da demanda', valueLabels: AeeLabels::DEMAND_ORIGINS),
            'study_date' => AuditedField::date('Data do Estudo de Caso'),
            'participants_summary' => AuditedField::richText('Participantes (resumo)'),
            'student_observation' => AuditedField::richText('Observação do estudante'),
            'student_family_listening' => AuditedField::richText('Escuta do estudante/família'),
            'teachers_listening' => AuditedField::richText('Escuta dos professores'),
            'other_info' => AuditedField::richText('Outras informações'),
            'care_network_notes' => AuditedField::richText('Observações da rede de cuidado'),
            'favorable_aspects' => AuditedField::richText('Aspectos favoráveis'),
            'potentials_interests' => AuditedField::richText('Potenciais e interesses'),
            'needed_supports' => AuditedField::list('Apoios necessários', valueLabels: AeeLabels::NEEDED_SUPPORTS),
            'needed_supports_justification' => AuditedField::richText('Justificativa dos apoios necessários'),
            'acceptance_status' => AuditedField::enum('Status de aceite', valueLabels: AeeLabels::ACCEPTANCE_STATUSES),
            'acceptance_date' => AuditedField::date('Data do aceite'),
            'completed_at' => AuditedField::dateTime('Concluído em'),
        ];
    }

    public function auditDescription(): string
    {
        $studentName = $this->student?->person?->name;

        return $studentName !== null
            ? "o Estudo de Caso #{$this->getKey()} de {$studentName}"
            : "o Estudo de Caso #{$this->getKey()}";
    }

    public static function register(Student $student, Semester $semester, int $creatorId, int $version, CaseStudyDTO $data): self
    {
        if (! $student->exists || ! $semester->exists) {
            throw new InvalidCaseStudy('O Estudo de Caso deve ser vinculado a aluno e semestre persistidos.');
        }

        return new self([
            'student_id' => $student->getKey(),
            'creator_id' => $creatorId,
            'semester_id' => $semester->getKey(),
            'version' => $version,
            'is_current' => true,
            'status' => self::STATUS_IN_PROGRESS,
            ...self::attributesFrom($data),
        ]);
    }

    public function revise(CaseStudyDTO $data): void
    {
        $this->ensureCanBeEdited();
        $this->fill(self::attributesFrom($data));
    }

    /** @throws InvalidCaseStudy */
    public function ensureCanBeEdited(): void
    {
        if ($this->status === self::STATUS_COMPLETED) {
            throw new InvalidCaseStudy('Este Estudo de Caso já foi concluído e não pode mais ser editado.');
        }
    }

    /** @throws InvalidCaseStudy */
    public function ensureCanBeCompleted(): void
    {
        $this->ensureCanBeEdited();

        if ($this->barriers()->count() < 1) {
            throw new InvalidCaseStudy('É necessário registrar ao menos uma barreira antes de concluir o Estudo de Caso.');
        }

        if ($this->strategies()->count() < 1) {
            throw new InvalidCaseStudy('É necessário registrar ao menos uma estratégia antes de concluir o Estudo de Caso.');
        }
    }

    public function markAsCompleted(): void
    {
        $this->status = self::STATUS_COMPLETED;
        $this->completed_at = now();
    }

    public function markAsHistorical(): void
    {
        $this->is_current = false;
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class);
    }

    public function barriers(): HasMany
    {
        return $this->hasMany(CaseStudyBarrier::class);
    }

    public function strategies(): HasMany
    {
        return $this->hasMany(CaseStudyStrategy::class);
    }

    public function contributions(): HasMany
    {
        return $this->hasMany(CaseStudyContribution::class);
    }

    public function paees(): HasMany
    {
        return $this->hasMany(Paee::class);
    }

    private static function attributesFrom(CaseStudyDTO $data): array
    {
        return [
            'demand_origin' => $data->demandOrigin,
            'participants_summary' => self::nullableText($data->participantsSummary),
            'study_date' => $data->studyDate,
            'student_observation' => $data->studentObservation,
            'student_family_listening' => $data->studentFamilyListening,
            'teachers_listening' => $data->teachersListening,
            'other_info' => self::nullableText($data->otherInfo),
            'care_network_notes' => self::nullableText($data->careNetworkNotes),
            'favorable_aspects' => $data->favorableAspects,
            'potentials_interests' => $data->potentialsInterests,
            'needed_supports' => $data->neededSupports,
            'needed_supports_justification' => self::nullableText($data->neededSupportsJustification),
            'acceptance_status' => $data->acceptanceStatus,
            'acceptance_date' => $data->acceptanceDate,
        ];
    }

    private static function nullableText(?string $value): ?string
    {
        $value = trim((string) $value);

        return $value === '' ? null : $value;
    }
}
