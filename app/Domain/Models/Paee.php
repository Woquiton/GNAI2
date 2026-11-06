<?php

declare(strict_types=1);

namespace App\Domain\Models;

use App\Domains\Audit\Domain\Contracts\Auditable;
use App\Domains\Audit\Domain\ValueObjects\AuditedField;
use App\Domains\Audit\Infrastructure\Eloquent\AuditsChanges;
use App\Domains\Auth\Domain\Models\User;
use App\Domain\DTOs\Paees\PaeeDTO;
use App\Domain\Exceptions\InvalidPaee;
use App\Shared\Domain\Support\AeeLabels;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Paee extends Model implements Auditable
{
    use AuditsChanges;
    use HasFactory;

    public const STATUS_DRAFT = 'draft';

    public const STATUS_ACTIVE = 'active';

    public const STATUS_UNDER_REVIEW = 'under_review';

    protected $table = 'paees';

    protected $fillable = [
        'case_study_id',
        'student_id',
        'creator_id',
        'semester_id',
        'version',
        'is_current',
        'status',
        'attendance_frequency_per_week',
        'attendance_duration_minutes',
        'attendance_format',
        'attendance_location',
        'assistive_technology_needed',
        'assistive_technology_notes',
        'assistive_technology_availability_capacity',
        'caa_needed',
        'caa_notes',
        'is_assistive_technology_portable_digital_device',
        'assistive_technology_pedagogical_opinion',
        'support_professional_needed',
        'support_professional_justification',
        'libras_interpreter_needed',
        'libras_interpreter_justification',
        'guide_interpreter_needed',
        'guide_interpreter_justification',
        'school_professionals_orientation',
        'common_teachers_articulation',
        'family_articulation',
        'intersectoral_articulation',
        'training_demands',
        'next_review_date',
    ];

    protected $casts = [
        'version' => 'integer',
        'is_current' => 'boolean',
        'attendance_frequency_per_week' => 'integer',
        'attendance_duration_minutes' => 'integer',
        'assistive_technology_needed' => 'boolean',
        'caa_needed' => 'boolean',
        'is_assistive_technology_portable_digital_device' => 'boolean',
        'support_professional_needed' => 'boolean',
        'libras_interpreter_needed' => 'boolean',
        'guide_interpreter_needed' => 'boolean',
        'next_review_date' => 'date',
    ];

    public static function auditType(): string
    {
        return 'paee';
    }

    public static function auditLabel(): string
    {
        return 'PAEE';
    }

    public static function auditedFields(): array
    {
        return [
            // Aluno e Estudo de Caso não têm coluna de nome própria; o histórico guarda os vínculos pelo id.
            'case_study_id' => AuditedField::number('ID do Estudo de Caso'),
            'student_id' => AuditedField::reference('Aluno', Student::class, 'person.name'),
            'creator_id' => AuditedField::reference('Criado por', User::class),
            'semester_id' => AuditedField::reference('Semestre', Semester::class, 'label'),
            'version' => AuditedField::number('Versão'),
            'is_current' => AuditedField::boolean('Vigente'),
            'status' => AuditedField::enum('Status', valueLabels: AeeLabels::PAEE_STATUSES),
            'attendance_frequency_per_week' => AuditedField::number('Frequência semanal'),
            'attendance_duration_minutes' => AuditedField::number('Duração (minutos)'),
            'attendance_format' => AuditedField::enum('Formato do atendimento', valueLabels: AeeLabels::ATTENDANCE_FORMATS),
            'attendance_location' => AuditedField::enum('Local do atendimento', valueLabels: AeeLabels::ATTENDANCE_LOCATIONS),
            'assistive_technology_needed' => AuditedField::boolean('Necessita de tecnologia assistiva'),
            'assistive_technology_notes' => AuditedField::richText('Observações sobre tecnologia assistiva'),
            'assistive_technology_availability_capacity' => AuditedField::richText('Capacidade de disponibilização da TA'),
            'caa_needed' => AuditedField::boolean('Necessita de Comunicação Aumentativa e Alternativa (CAA)'),
            'caa_notes' => AuditedField::richText('Observações sobre CAA'),
            'is_assistive_technology_portable_digital_device' => AuditedField::boolean('A tecnologia assistiva é um dispositivo digital portátil'),
            'assistive_technology_pedagogical_opinion' => AuditedField::richText('Parecer pedagógico sobre a TA portátil'),
            'support_professional_needed' => AuditedField::boolean('Necessita de profissional de apoio'),
            'support_professional_justification' => AuditedField::richText('Justificativa do profissional de apoio'),
            'libras_interpreter_needed' => AuditedField::boolean('Necessita de tradutor/intérprete de Libras'),
            'libras_interpreter_justification' => AuditedField::richText('Justificativa do intérprete de Libras'),
            'guide_interpreter_needed' => AuditedField::boolean('Necessita de guia-intérprete'),
            'guide_interpreter_justification' => AuditedField::richText('Justificativa do guia-intérprete'),
            'school_professionals_orientation' => AuditedField::richText('Orientação aos profissionais da escola'),
            'common_teachers_articulation' => AuditedField::richText('Articulação com professores do ensino comum'),
            'family_articulation' => AuditedField::richText('Como a família será envolvida'),
            'intersectoral_articulation' => AuditedField::richText('Articulação intersetorial'),
            'training_demands' => AuditedField::richText('Demandas de formação'),
            'next_review_date' => AuditedField::date('Próxima revisão'),
        ];
    }

    public function auditDescription(): string
    {
        $studentName = $this->student?->person?->name;

        return $studentName !== null
            ? "o PAEE #{$this->getKey()} de {$studentName}"
            : "o PAEE #{$this->getKey()}";
    }

    public static function register(CaseStudy $caseStudy, Student $student, Semester $semester, int $creatorId, int $version, PaeeDTO $data): self
    {
        // A regra de elegibilidade (Estudo de Caso concluído OU Laudo anexado ao aluno)
        // é validada em CreatePaeeAction, que precisa consultar os documentos do aluno
        // antes de chamar este método. Aqui só garantimos a integridade referencial.
        if (! $caseStudy->exists || ! $student->exists || ! $semester->exists) {
            throw new InvalidPaee('O PAEE deve ser vinculado a aluno e semestre persistidos.');
        }

        return new self([
            'case_study_id' => $caseStudy->getKey(),
            'student_id' => $student->getKey(),
            'creator_id' => $creatorId,
            'semester_id' => $semester->getKey(),
            'version' => $version,
            'is_current' => true,
            'status' => self::STATUS_ACTIVE,
            'next_review_date' => now()->addMonths(6)->toDateString(),
            ...self::attributesFrom($data),
        ]);
    }

    public function revise(PaeeDTO $data): void
    {
        $this->fill(self::attributesFrom($data));
    }

    public function markAsUnderReview(): void
    {
        $this->status = self::STATUS_UNDER_REVIEW;
        $this->next_review_date = now()->addMonths(6)->toDateString();
    }

    public function markAsHistorical(): void
    {
        $this->is_current = false;
    }

    public function caseStudy(): BelongsTo
    {
        return $this->belongsTo(CaseStudy::class);
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

    public function objectives(): HasMany
    {
        return $this->hasMany(PaeeObjective::class);
    }

    public function resources(): HasMany
    {
        return $this->hasMany(PaeeResource::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(PaeeReview::class);
    }

    private static function attributesFrom(PaeeDTO $data): array
    {
        return [
            'attendance_frequency_per_week' => $data->attendanceFrequencyPerWeek,
            'attendance_duration_minutes' => $data->attendanceDurationMinutes,
            'attendance_format' => $data->attendanceFormat,
            'attendance_location' => $data->attendanceLocation,
            'assistive_technology_needed' => $data->assistiveTechnologyNeeded,
            'assistive_technology_notes' => self::nullableText($data->assistiveTechnologyNotes),
            'assistive_technology_availability_capacity' => self::nullableText($data->assistiveTechnologyAvailabilityCapacity),
            'caa_needed' => $data->caaNeeded,
            'caa_notes' => self::nullableText($data->caaNotes),
            'is_assistive_technology_portable_digital_device' => $data->isAssistiveTechnologyPortableDigitalDevice,
            'assistive_technology_pedagogical_opinion' => self::nullableText($data->assistiveTechnologyPedagogicalOpinion),
            'support_professional_needed' => $data->supportProfessionalNeeded,
            'support_professional_justification' => self::nullableText($data->supportProfessionalJustification),
            'libras_interpreter_needed' => $data->librasInterpreterNeeded,
            'libras_interpreter_justification' => self::nullableText($data->librasInterpreterJustification),
            'guide_interpreter_needed' => $data->guideInterpreterNeeded,
            'guide_interpreter_justification' => self::nullableText($data->guideInterpreterJustification),
            'school_professionals_orientation' => self::nullableText($data->schoolProfessionalsOrientation),
            'common_teachers_articulation' => self::nullableText($data->commonTeachersArticulation),
            'family_articulation' => self::nullableText($data->familyArticulation),
            'intersectoral_articulation' => self::nullableText($data->intersectoralArticulation),
            'training_demands' => self::nullableText($data->trainingDemands),
        ];
    }

    private static function nullableText(?string $value): ?string
    {
        $value = trim((string) $value);

        return $value === '' ? null : $value;
    }
}
