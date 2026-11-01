<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Domain\Models;

use App\Domains\Audit\Domain\Contracts\Auditable;
use App\Domains\Audit\Domain\ValueObjects\AuditedField;
use App\Domains\Audit\Infrastructure\Eloquent\AuditsChanges;
use App\Domains\Auth\Domain\Models\User;
use App\Domains\Inclusion\Domain\DTOs\PeiDisciplines\CreatePeiDisciplineDTO;
use App\Domains\Inclusion\Domain\DTOs\PeiDisciplines\UpdatePeiDisciplineDTO;
use App\Domains\Inclusion\Domain\Exceptions\InvalidPeiDiscipline;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class PeiDiscipline extends Model implements Auditable
{
    use AuditsChanges;
    use HasFactory;

    /**
     * Texto provisório usado pela atribuição em lote (BulkAssignPeiDisciplinesAction)
     * enquanto o conteúdo pedagógico de verdade não é preenchido. Um PEI não pode
     * ser finalizado enquanto algum campo obrigatório ainda tiver esse valor.
     */
    public const PLACEHOLDER_TEXT = 'A preencher.';

    protected $table = 'pei_disciplines';

    protected $fillable = [
        'pei_id',
        'creator_id',
        'teacher_id',
        'discipline_id',
        'specific_objectives',
        'content_programmatic',
        'methodologies',
        'evaluations',
        'opinion',
        'complementary_records',
        'curricular_reference',
        'materials_and_assistive_technology',
        'objectives_deadline',
    ];

    public static function auditType(): string
    {
        return 'pei_discipline';
    }

    public static function auditLabel(): string
    {
        return 'Adaptação Curricular do PEI';
    }

    public static function auditedFields(): array
    {
        return [
            // PEI e professor não têm coluna de nome própria (o nome do professor mora em `people`); ficam pelo id.
            'pei_id' => AuditedField::number('ID do PEI'),
            'creator_id' => AuditedField::reference('Criada por', User::class),
            'teacher_id' => AuditedField::reference('Professor responsável', Teacher::class, 'person.name'),
            'discipline_id' => AuditedField::reference('Disciplina', Discipline::class),
            'specific_objectives' => AuditedField::text('Objetivos específicos'),
            'objectives_deadline' => AuditedField::text('Prazo das metas/objetivos'),
            'content_programmatic' => AuditedField::text('Conteúdo programático'),
            'curricular_reference' => AuditedField::text('Referência curricular (BNCC ou ementa/unidade)'),
            'methodologies' => AuditedField::text('Metodologias e estratégias'),
            'materials_and_assistive_technology' => AuditedField::text('Recursos didáticos e tecnologia assistiva'),
            'evaluations' => AuditedField::text('Processo de avaliação'),
            'opinion' => AuditedField::text('Parecer'),
            'complementary_records' => AuditedField::text('Registros complementares'),
        ];
    }

    public function auditDescription(): string
    {
        $disciplineName = $this->discipline?->name;

        return $disciplineName !== null
            ? "a adaptação curricular de {$disciplineName} do PEI #{$this->pei_id}"
            : "a adaptação curricular #{$this->getKey()} do PEI #{$this->pei_id}";
    }

    /**
     * @throws InvalidPeiDiscipline
     */
    public static function register(
        Pei $pei,
        User $creator,
        Teacher $teacher,
        Discipline $discipline,
        CreatePeiDisciplineDTO $data,
    ): self {
        self::ensurePersisted($pei, $creator, $teacher, $discipline);

        return new self([
            'pei_id' => $pei->getKey(),
            'creator_id' => $creator->getKey(),
            'teacher_id' => $teacher->getKey(),
            'discipline_id' => $discipline->getKey(),
            'specific_objectives' => self::normalizeText($data->specificObjectives),
            'content_programmatic' => self::normalizeText($data->contentProgrammatic),
            'methodologies' => self::normalizeText($data->methodologies),
            'evaluations' => self::normalizeText($data->evaluations),
            'opinion' => self::normalizeNullableText($data->opinion),
            'complementary_records' => self::normalizeNullableText($data->complementaryRecords),
            'curricular_reference' => self::normalizeNullableText($data->curricularReference),
            'materials_and_assistive_technology' => self::normalizeNullableText($data->materialsAndAssistiveTechnology),
            'objectives_deadline' => self::normalizeNullableText($data->objectivesDeadline),
        ]);
    }

    public function revise(
        Teacher $teacher,
        Discipline $discipline,
        UpdatePeiDisciplineDTO $data,
    ): void {
        $this->fill([
            'teacher_id' => $teacher->getKey(),
            'discipline_id' => $discipline->getKey(),
            'specific_objectives' => self::normalizeText($data->specificObjectives),
            'content_programmatic' => self::normalizeText($data->contentProgrammatic),
            'methodologies' => self::normalizeText($data->methodologies),
            'evaluations' => self::normalizeText($data->evaluations),
            'opinion' => self::normalizeNullableText($data->opinion),
            'complementary_records' => self::normalizeNullableText($data->complementaryRecords),
            'curricular_reference' => self::normalizeNullableText($data->curricularReference),
            'materials_and_assistive_technology' => self::normalizeNullableText($data->materialsAndAssistiveTechnology),
            'objectives_deadline' => self::normalizeNullableText($data->objectivesDeadline),
        ]);
    }

    /**
     * @throws InvalidPeiDiscipline
     */
    public function ensureCanBeManagedBy(?int $userId): void
    {
        if ($userId === null || (int) $this->creator_id !== $userId) {
            throw new InvalidPeiDiscipline('Apenas o criador desta adaptação pode editá-la ou removê-la.');
        }
    }

    /**
     * Permite edição (não exclusão) tanto por quem criou o registro quanto
     * pelo próprio professor responsável pela disciplina — usado pelo acesso
     * de professor via link único, que só pode ajustar a própria adaptação.
     *
     * @throws InvalidPeiDiscipline
     */
    public function ensureCanBeEditedBy(?int $userId, ?int $teacherId): void
    {
        $isCreator = $userId !== null && (int) $this->creator_id === $userId;
        $isResponsibleTeacher = $teacherId !== null && (int) $this->teacher_id === $teacherId;

        if (! $isCreator && ! $isResponsibleTeacher) {
            throw new InvalidPeiDiscipline('Apenas o criador ou o professor responsável por esta adaptação pode editá-la.');
        }
    }

    public function pei(): BelongsTo
    {
        return $this->belongsTo(Pei::class, 'pei_id');
    }

    public function discipline(): BelongsTo
    {
        return $this->belongsTo(Discipline::class);
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }

    public function revisions(): HasMany
    {
        return $this->hasMany(PeiDisciplineRevision::class)->latest('reviewed_at');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function getTeacherDisplayNameAttribute(): string
    {
        return $this->teacher?->person?->name ?? 'Professor s/ Nome';
    }

    /**
     * @throws InvalidPeiDiscipline
     */
    private static function ensurePersisted(Pei $pei, User $creator, Teacher $teacher, Discipline $discipline): void
    {
        if (! $pei->exists || ! $creator->exists || ! $teacher->exists || ! $discipline->exists) {
            throw new InvalidPeiDiscipline(
                'A adaptação do PEI deve ser vinculada a PEI, criador, professor e disciplina persistidos.'
            );
        }
    }

    private static function normalizeText(string $value): string
    {
        return trim($value);
    }

    private static function normalizeNullableText(?string $value): ?string
    {
        $value = trim((string) $value);

        return $value === '' ? null : $value;
    }
}
