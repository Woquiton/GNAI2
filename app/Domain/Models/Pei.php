<?php

declare(strict_types=1);

namespace App\Domain\Models;

use App\Domains\Audit\Domain\Contracts\Auditable;
use App\Domains\Audit\Domain\ValueObjects\AuditedField;
use App\Domains\Audit\Infrastructure\Eloquent\AuditsChanges;
use App\Domains\Auth\Domain\Models\User;
use App\Domain\DTOs\Peis\CreatePeiDTO;
use App\Domain\Exceptions\InvalidPei;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Pei extends Model implements Auditable
{
    use AuditsChanges;
    use HasFactory;

    protected $table = 'peis';

    protected $fillable = [
        'student_id',
        'creator_id',
        'semester_id',
        'course_id',
        'paee_id',
        'is_finished',
        'version',
        'is_current',
        'other_relevant_info',
    ];

    /** @throws InvalidPei */
    public function updateOtherRelevantInfo(?string $value): void
    {
        $value = trim((string) $value);
        $this->other_relevant_info = $value === '' ? null : $value;
    }

    protected $casts = [
        'is_finished' => 'boolean',
        'is_current' => 'boolean',
        'version' => 'integer',
    ];

    public static function auditType(): string
    {
        return 'pei';
    }

    public static function auditLabel(): string
    {
        return 'PEI';
    }

    public static function auditedFields(): array
    {
        return [
            // Aluno e PAEE não têm coluna de nome própria (o nome do aluno mora em `people`); ficam pelo id.
            'student_id' => AuditedField::reference('Aluno', Student::class, 'person.name'),
            'creator_id' => AuditedField::reference('Criado por', User::class),
            'semester_id' => AuditedField::reference('Semestre', Semester::class, 'label'),
            'course_id' => AuditedField::reference('Curso', Course::class),
            'paee_id' => AuditedField::number('ID do PAEE'),
            'is_finished' => AuditedField::boolean('Finalizado'),
            'version' => AuditedField::number('Versão'),
            'is_current' => AuditedField::boolean('Vigente'),
            'other_relevant_info' => AuditedField::text('Outras informações relevantes'),
        ];
    }

    public function auditDescription(): string
    {
        $studentName = $this->student?->person?->name;

        return $studentName !== null
            ? "o PEI #{$this->getKey()} de {$studentName}"
            : "o PEI #{$this->getKey()}";
    }

    /**
     * @throws InvalidPei
     */
    public static function register(
        Student $student,
        Semester $semester,
        Course $course,
        Paee $paee,
        CreatePeiDTO $data,
    ): self {
        self::ensurePersisted($student, $semester, $course, $paee);

        return new self([
            'student_id' => $student->getKey(),
            'creator_id' => $data->creatorId,
            'semester_id' => $semester->getKey(),
            'course_id' => $course->getKey(),
            'paee_id' => $paee->getKey(),
            'is_finished' => $data->isFinished,
            'version' => $data->version,
            'is_current' => $data->isCurrent,
        ]);
    }

    /**
     * @throws InvalidPei
     */
    /** Administradores também gerenciam, para que o PEI não fique travado quando o autor deixa o núcleo. */
    public function ensureCanBeManagedBy(?int $userId, bool $isAdministrator = false): void
    {
        if ($isAdministrator) {
            return;
        }

        if ($userId === null || (int) $this->creator_id !== $userId) {
            throw new InvalidPei('Acesso negado: apenas o criador do PEI ou um administrador pode gerenciar este registro.');
        }
    }

    /**
     * @throws InvalidPei
     */
    public function ensureCanCreateNewVersion(): void
    {
        if (! $this->is_finished) {
            throw new InvalidPei('O PEI atual ainda está em andamento. Finalize-o antes de criar uma nova versão.');
        }
    }

    /**
     * @throws InvalidPei
     */
    public function ensureCanBeFinished(): void
    {
        $this->loadMissing('peiDisciplines.discipline');

        if ($this->peiDisciplines->isEmpty()) {
            throw new InvalidPei('O PEI precisa ter ao menos uma adaptação cadastrada antes de ser finalizado.');
        }

        $requiredFields = [
            'specific_objectives' => 'objetivos específicos',
            'content_programmatic' => 'conteúdo programático',
            'methodologies' => 'metodologias e estratégias',
            'evaluations' => 'processo de avaliação',
            'opinion' => 'parecer',
        ];

        $isIncomplete = fn (PeiDiscipline $peiDiscipline, string $field): bool => blank($peiDiscipline->{$field})
            || $peiDiscipline->{$field} === PeiDiscipline::PLACEHOLDER_TEXT;

        $incompleteDiscipline = $this->peiDisciplines->first(function (PeiDiscipline $peiDiscipline) use ($requiredFields, $isIncomplete): bool {
            foreach (array_keys($requiredFields) as $field) {
                if ($isIncomplete($peiDiscipline, $field)) {
                    return true;
                }
            }

            return false;
        });

        if ($incompleteDiscipline instanceof PeiDiscipline) {
            $missingFields = collect($requiredFields)
                ->filter(fn (string $label, string $field): bool => $isIncomplete($incompleteDiscipline, $field))
                ->values()
                ->implode(', ');

            $disciplineName = $incompleteDiscipline->discipline->name ?? 'disciplina sem identificação';

            throw new InvalidPei(
                "Não é possível finalizar o PEI. A adaptação da disciplina {$disciplineName} precisa preencher: {$missingFields}."
            );
        }
    }

    public function markAsFinished(): void
    {
        $this->is_finished = true;
        $this->is_current = true;
    }

    public function markAsHistorical(): void
    {
        $this->is_current = false;
    }

    /**
     * Acompanha a nova versão do PAEE do aluno enquanto o PEI está em elaboração.
     * O PEI finalizado é documento fechado e mantém o PAEE que o fundamentou.
     */
    public function followPaee(Paee $paee): void
    {
        if ($this->is_finished || (int) $paee->student_id !== (int) $this->student_id) {
            return;
        }

        $this->paee_id = $paee->getKey();
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function paee(): BelongsTo
    {
        return $this->belongsTo(Paee::class);
    }

    public function peiDisciplines(): HasMany
    {
        return $this->hasMany(PeiDiscipline::class, 'pei_id');
    }

    /**
     * @throws InvalidPei
     */
    private static function ensurePersisted(Student $student, Semester $semester, Course $course, Paee $paee): void
    {
        if (! $student->exists || ! $semester->exists || ! $course->exists || ! $paee->exists) {
            throw new InvalidPei(
                'O PEI deve ser vinculado a aluno, semestre, curso e PAEE persistidos.'
            );
        }
    }
}
