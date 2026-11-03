<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Domain\Models;

use App\Domains\Audit\Domain\Contracts\Auditable;
use App\Domains\Audit\Domain\ValueObjects\AuditedField;
use App\Domains\Audit\Infrastructure\Eloquent\AuditsChanges;
use App\Domains\Inclusion\Domain\DTOs\Courses\CreateCourseDTO;
use App\Domains\Inclusion\Domain\DTOs\Courses\UpdateCourseDTO;
use App\Domains\Inclusion\Domain\Exceptions\InvalidCourse;
use Database\Factories\Domains\Inclusion\CourseFactory;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[UseFactory(CourseFactory::class)]
final class Course extends Model implements Auditable
{
    use AuditsChanges;
    use HasFactory;

    /** Maior período (semestre ou série) aceito na matriz curricular. */
    public const MAX_COURSE_PERIOD = 12;

    protected $table = 'courses';

    protected $fillable = [
        'name',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public static function auditType(): string
    {
        return 'course';
    }

    public static function auditLabel(): string
    {
        return 'Curso';
    }

    public static function auditedFields(): array
    {
        return [
            'name' => AuditedField::text('Nome do Curso'),
            'description' => AuditedField::richText('Descrição'),
            'is_active' => AuditedField::boolean('Ativo'),
            'disciplines' => AuditedField::list('Disciplinas do curso', model: Discipline::class),
            'curriculum_periods' => AuditedField::text('Períodos da matriz curricular'),
        ];
    }

    public function auditDescription(): string
    {
        return "o curso {$this->name}";
    }

    /** @return array<string, mixed> */
    public function auditExtraValues(): array
    {
        return $this->exists
            ? [
                'disciplines' => $this->disciplines()->pluck('disciplines.id')->all(),
                'curriculum_periods' => $this->curriculumPeriodsSummary(),
            ]
            : [];
    }

    public static function register(CreateCourseDTO $data): self
    {
        return new self([
            'name' => self::normalizeName($data->name),
            'description' => self::normalizeDescription($data->description),
            'is_active' => $data->isActive,
        ]);
    }

    public function revise(UpdateCourseDTO $data): void
    {
        $this->fill([
            'name' => self::normalizeName($data->name),
            'description' => self::normalizeDescription($data->description),
            'is_active' => $data->isActive,
        ]);
    }

    /**
     * Define a matriz curricular. `$periods` informa, por id da disciplina, o período do curso em que ela
     * é cursada; sem período, a disciplina fica fora das sugestões por período.
     *
     * @param  list<int|string>  $disciplineIds
     * @param  array<int|string, int|string|null>  $periods
     *
     * @throws InvalidCourse
     */
    public function assignCurriculum(array $disciplineIds, array $periods = []): void
    {
        if (! $this->exists) {
            throw new InvalidCourse(
                'A matriz curricular só pode ser atribuída a um curso persistido.'
            );
        }

        $disciplineIds = array_values(array_unique(array_map('intval', $disciplineIds)));
        $before = array_map('intval', $this->disciplines()->pluck('disciplines.id')->all());
        $periodsBefore = $this->curriculumPeriodsSummary();
        $removedIds = array_values(array_diff($before, $disciplineIds));

        if ($removedIds !== []) {
            // Sem a disciplina na matriz, o vínculo do professor com ela neste curso deixa de valer.
            TeacherCourseDiscipline::query()
                ->where('course_id', $this->getKey())
                ->whereIn('discipline_id', $removedIds)
                ->get()
                ->each->delete();
        }

        $rows = [];

        foreach ($disciplineIds as $disciplineId) {
            $rows[$disciplineId] = ['course_period' => self::normalizePeriod($periods[$disciplineId] ?? null)];
        }

        $this->disciplines()->sync($rows);
        $this->recordAuditFieldChange('disciplines', $before, $this->disciplines()->pluck('disciplines.id')->all());
        $this->recordAuditFieldChange('curriculum_periods', $periodsBefore, $this->curriculumPeriodsSummary());
    }

    /**
     * Disciplinas com adaptações de PEI ou com reprovação e risco de alunos do curso não podem sair da
     * matriz curricular.
     *
     * @param  list<string>  $disciplineNamesInUse  disciplinas retiradas que ainda estão em uso
     *
     * @throws InvalidCourse
     */
    public function ensureDisciplinesCanLeaveCurriculum(array $disciplineNamesInUse): void
    {
        if ($disciplineNamesInUse === []) {
            return;
        }

        $names = implode(', ', $disciplineNamesInUse);

        throw new InvalidCourse(
            "Não é possível retirar da matriz: {$names}. Há adaptações de PEI ou registros de reprovação e risco dos alunos deste curso nessas disciplinas."
        );
    }

    /** Texto legível dos períodos da matriz para o histórico de alterações. */
    private function curriculumPeriodsSummary(): ?string
    {
        $summary = $this->disciplines()
            ->orderBy('disciplines.name')
            ->get()
            ->filter(fn (Discipline $discipline): bool => $discipline->pivot->course_period !== null)
            ->map(fn (Discipline $discipline): string => "{$discipline->name}: {$discipline->pivot->course_period}º")
            ->implode('; ');

        return $summary === '' ? null : $summary;
    }

    private static function normalizePeriod(int|string|null $period): ?int
    {
        if ($period === null || $period === '') {
            return null;
        }

        $period = (int) $period;

        if ($period < 1 || $period > self::MAX_COURSE_PERIOD) {
            throw new InvalidCourse('O período da disciplina deve estar entre 1 e '.self::MAX_COURSE_PERIOD.'.');
        }

        return $period;
    }

    /**
     * @throws InvalidCourse
     */
    public function ensureCanBeDeactivated(bool $hasStudents): void
    {
        if ($hasStudents) {
            throw new InvalidCourse(
                'Este curso está vinculado a um ou mais alunos e não pode ser desativado.'
            );
        }
    }

    /**
     * @throws InvalidCourse
     */
    public function ensureCanBeDeleted(bool $hasStudents, bool $hasPeis = false): void
    {
        if ($hasStudents) {
            throw new InvalidCourse(
                'Este curso está vinculado a um ou mais alunos e não pode ser excluído.'
            );
        }

        if ($hasPeis) {
            throw new InvalidCourse(
                'Este curso possui PEIs vinculados e não pode ser excluído.'
            );
        }
    }

    /**
     * @throws InvalidCourse
     */
    public function ensureIsActive(): void
    {
        if (! $this->is_active) {
            throw new InvalidCourse(
                'Este curso está desativado e não pode ser vinculado.'
            );
        }
    }

    public function studentCourses(): HasMany
    {
        return $this->hasMany(StudentCourse::class, 'course_id');
    }

    public function disciplines(): BelongsToMany
    {
        return $this->belongsToMany(
            Discipline::class,
            'course_disciplines',
            'course_id',
            'discipline_id',
        )
            ->withPivot('course_period')
            ->withTimestamps();
    }

    private static function normalizeName(string $name): string
    {
        return trim($name);
    }

    private static function normalizeDescription(?string $description): ?string
    {
        $description = trim((string) $description);

        return $description === '' ? null : $description;
    }
}
