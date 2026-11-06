<?php

declare(strict_types=1);

namespace App\Domains\Domain\Models\StudentCourses;

use App\Domains\Domain\Contracts\Audit\Auditable;
use App\Domains\Domain\ValueObjects\Audit\AuditedField;
use App\Domains\Infrastructure\Eloquent\Audit\AuditsChanges;
use App\Domains\Domain\Models\Courses\Course;
use App\Domains\Domain\Models\Disciplines\Discipline;
use App\Domains\Domain\Models\Semesters\Semester;
use App\Domains\Domain\DTOs\StudentCourses\CreateStudentCourseDTO;
use App\Domains\Domain\DTOs\StudentCourses\UpdateStudentCourseDTO;
use App\Domains\Domain\Enums\StudentCourses\StudentCourseDisciplineCategory;
use App\Domains\Domain\Exceptions\StudentCourses\InvalidStudentCourse;
use App\Domains\Domain\Models\Students\Student;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Support\Collection;

final class StudentCourse extends Pivot implements Auditable
{
    use AuditsChanges;
    use HasFactory;

    protected $table = 'student_courses';

    public $incrementing = true;

    protected $keyType = 'int';

    protected $fillable = [
        'student_id',
        'course_id',
        'academic_year',
        'semester_id',
        'is_current',
        'school_attendance_status',
    ];

    protected $casts = [
        'academic_year' => 'integer',
        'is_current' => 'boolean',
    ];

    public static function auditType(): string
    {
        return 'student_course';
    }

    public static function auditLabel(): string
    {
        return 'Matrícula em Curso';
    }

    public static function auditedFields(): array
    {
        return [
            'student_id' => AuditedField::reference('Aluno', Student::class, 'person.name'),
            'course_id' => AuditedField::reference('Curso / Série', Course::class),
            'academic_year' => AuditedField::text('Ano Letivo'),
            'semester_id' => AuditedField::reference('Semestre', Semester::class, 'label'),
            'is_current' => AuditedField::boolean('Curso atual'),
            'school_attendance_status' => AuditedField::richText('Situação da Frequência Escolar'),
            // Formato anterior, sem semestre: mantido para a leitura do histórico de alterações.
            'failed_disciplines' => AuditedField::list('Disciplinas com Reprovação', model: Discipline::class),
            'at_risk_disciplines' => AuditedField::list('Disciplinas com Risco de Insucesso Acadêmico', model: Discipline::class),
            'failed_disciplines_by_semester' => AuditedField::text('Disciplinas com Reprovação por semestre'),
            'at_risk_disciplines_by_semester' => AuditedField::text('Disciplinas com Risco de Insucesso Acadêmico por semestre'),
            'resolved_dependencies' => AuditedField::text('Dependências aprovadas'),
        ];
    }

    public function auditDescription(): string
    {
        $studentName = $this->student?->person?->name ?? "#{$this->student_id}";
        $courseName = $this->course?->name ?? "#{$this->course_id}";

        return "a matrícula de {$studentName} em {$courseName}";
    }

    /** @return array<string, mixed> */
    public function auditExtraValues(): array
    {
        return $this->exists
            ? [
                'failed_disciplines_by_semester' => $this->academicRecordsSummary(StudentCourseDisciplineCategory::FAILED),
                'at_risk_disciplines_by_semester' => $this->academicRecordsSummary(StudentCourseDisciplineCategory::AT_ACADEMIC_RISK),
                'resolved_dependencies' => $this->resolvedDependenciesSummary(),
            ]
            : [];
    }

    /**
     * @throws InvalidStudentCourse
     */
    public static function register(Student $student, Course $course, CreateStudentCourseDTO $data): self
    {
        self::ensurePersisted($student, $course);

        return new self([
            'student_id' => $student->getKey(),
            'course_id' => $course->getKey(),
            'academic_year' => $data->academicYear,
            'semester_id' => $data->semesterId,
            'is_current' => $data->isCurrent,
            'school_attendance_status' => self::nullableText($data->schoolAttendanceStatus),
        ]);
    }

    /**
     * @throws InvalidStudentCourse
     */
    public function revise(Course $course, UpdateStudentCourseDTO $data): void
    {
        if (! $course->exists) {
            throw new InvalidStudentCourse('A matrícula deve ser vinculada a um curso persistido.');
        }

        $this->fill([
            'course_id' => $course->getKey(),
            'academic_year' => $data->academicYear,
            'semester_id' => $data->semesterId,
            'school_attendance_status' => self::nullableText($data->schoolAttendanceStatus),
        ]);
    }

    public function markAsNotCurrent(): void
    {
        $this->fill(['is_current' => false]);
    }

    public function markAsCurrent(): void
    {
        $this->fill(['is_current' => true]);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class);
    }

    /** Período do curso do aluno em cada semestre letivo desta matrícula. */
    public function semesterRecords(): HasMany
    {
        return $this->hasMany(StudentCourseSemester::class, 'student_course_id');
    }

    /** Grava ou remove o período do aluno no semestre informado. */
    public function syncCoursePeriod(?int $semesterId, ?int $coursePeriod): void
    {
        if ($semesterId === null) {
            return;
        }

        if ($coursePeriod === null) {
            $this->semesterRecords()->where('semester_id', $semesterId)->get()->each->delete();

            return;
        }

        StudentCourseSemester::record($this, Semester::query()->findOrFail($semesterId), $coursePeriod);
    }

    /** Registro de período mais recente em um semestre anterior ao informado. */
    public function semesterRecordBefore(Semester $semester): ?StudentCourseSemester
    {
        $this->loadMissing('semesterRecords.semester');

        return $this->semesterRecords
            ->filter(fn (StudentCourseSemester $record): bool => $record->semester?->isBefore($semester) ?? false)
            ->sortByDesc(fn (StudentCourseSemester $record): int => $record->semester->year * 10 + $record->semester->term)
            ->first();
    }

    /**
     * Situação sugerida na virada de semestre: quem já tem período no destino fica como está, quem está
     * no último período permanece e os demais avançam.
     */
    public function defaultRolloverAction(Semester $target): string
    {
        $this->loadMissing('semesterRecords');

        if ($this->semesterRecords->contains('semester_id', $target->getKey())) {
            return 'skip';
        }

        $previousPeriod = $this->semesterRecordBefore($target)?->course_period;

        return $previousPeriod !== null && $previousPeriod >= Course::MAX_COURSE_PERIOD ? 'retain' : 'advance';
    }

    /**
     * Período do aluno no semestre de destino da virada: o anterior mais um (`advance`) ou o mesmo
     * (`retain`). Sem período anterior, vale o período informado.
     */
    public function rolloverCoursePeriod(Semester $target, string $action, ?int $informedPeriod): ?int
    {
        $previous = $this->semesterRecordBefore($target);

        if ($previous === null) {
            return $informedPeriod;
        }

        return $action === 'advance' ? $previous->course_period + 1 : $previous->course_period;
    }

    public function coursePeriodIn(?int $semesterId): ?int
    {
        if ($semesterId === null) {
            return null;
        }

        $period = $this->relationLoaded('semesterRecords')
            ? $this->semesterRecords->firstWhere('semester_id', $semesterId)?->course_period
            : $this->semesterRecords()->where('semester_id', $semesterId)->value('course_period');

        return $period === null ? null : (int) $period;
    }

    /** Reprovações de todos os semestres; o pivô traz `semester_id` e `resolved_semester_id`. */
    public function failedDisciplines(): BelongsToMany
    {
        return $this->disciplinesByCategory(StudentCourseDisciplineCategory::FAILED);
    }

    /** Riscos de insucesso de todos os semestres; o pivô traz `semester_id`. */
    public function atRiskDisciplines(): BelongsToMany
    {
        return $this->disciplinesByCategory(StudentCourseDisciplineCategory::AT_ACADEMIC_RISK);
    }

    /** @param list<int> $disciplineIds */
    public function syncFailedDisciplines(int $semesterId, array $disciplineIds): void
    {
        $before = $this->academicRecordsSummary(StudentCourseDisciplineCategory::FAILED);
        $this->failedDisciplines()
            ->withPivotValue('semester_id', $semesterId)
            ->sync(array_values(array_unique(array_map('intval', $disciplineIds))));
        $this->recordAuditFieldChange(
            'failed_disciplines_by_semester',
            $before,
            $this->academicRecordsSummary(StudentCourseDisciplineCategory::FAILED),
        );
    }

    /** @param list<int> $disciplineIds */
    public function syncAtRiskDisciplines(int $semesterId, array $disciplineIds): void
    {
        $before = $this->academicRecordsSummary(StudentCourseDisciplineCategory::AT_ACADEMIC_RISK);
        $this->atRiskDisciplines()
            ->withPivotValue('semester_id', $semesterId)
            ->sync(array_values(array_unique(array_map('intval', $disciplineIds))));
        $this->recordAuditFieldChange(
            'at_risk_disciplines_by_semester',
            $before,
            $this->academicRecordsSummary(StudentCourseDisciplineCategory::AT_ACADEMIC_RISK),
        );
    }

    /**
     * Grava reprovações e riscos do semestre informado. Os outros semestres não mudam.
     *
     * @param  list<int>  $failedDisciplineIds
     * @param  list<int>  $atRiskDisciplineIds
     *
     * @throws InvalidStudentCourse
     */
    public function syncDisciplines(
        Course $course,
        ?int $semesterId,
        array $failedDisciplineIds,
        array $atRiskDisciplineIds,
    ): void {
        if ($semesterId === null) {
            if ([...$failedDisciplineIds, ...$atRiskDisciplineIds] !== []) {
                throw new InvalidStudentCourse('Informe o semestre das reprovações e dos riscos de insucesso.');
            }

            return;
        }

        $allowedIds = $course->disciplines()
            ->pluck('disciplines.id')
            ->map(static fn (mixed $id): int => (int) $id)
            ->all();

        if (array_diff(array_map('intval', [...$failedDisciplineIds, ...$atRiskDisciplineIds]), $allowedIds) !== []) {
            throw new InvalidStudentCourse('As disciplinas selecionadas devem pertencer ao curso do aluno.');
        }

        $this->syncFailedDisciplines($semesterId, $failedDisciplineIds);
        $this->syncAtRiskDisciplines($semesterId, $atRiskDisciplineIds);
    }

    /**
     * Marca como aprovadas no semestre as dependências informadas e desfaz as que deixaram de ser
     * informadas. `$dependencyIds` são as dependências do aluno vistas a partir desse semestre.
     *
     * @param  list<int>  $disciplineIds
     * @param  list<int>  $dependencyIds
     *
     * @throws InvalidStudentCourse
     */
    public function resolveDependencies(Semester $semester, array $disciplineIds, array $dependencyIds): void
    {
        $disciplineIds = array_values(array_unique(array_map('intval', $disciplineIds)));

        if (array_diff($disciplineIds, $dependencyIds) !== []) {
            throw new InvalidStudentCourse('Só é possível aprovar dependências de reprovações de semestres anteriores.');
        }

        $before = $this->resolvedDependenciesSummary();
        $failed = $this->failedDisciplines()->get();
        $semesters = Semester::query()
            ->whereIn('id', $failed->pluck('pivot.semester_id')->unique())
            ->get()
            ->keyBy('id');

        foreach ($failed as $discipline) {
            $failedIn = $semesters->get($discipline->pivot->semester_id);
            $resolvedIn = $discipline->pivot->resolved_semester_id;
            $selected = in_array((int) $discipline->getKey(), $disciplineIds, true);
            $resolution = match (true) {
                $selected && $resolvedIn === null && ($failedIn?->isBefore($semester) ?? false) => $semester->getKey(),
                ! $selected && (int) $resolvedIn === (int) $semester->getKey() => null,
                default => false,
            };

            if ($resolution === false) {
                continue;
            }

            $this->failedDisciplines()
                ->wherePivot('semester_id', $discipline->pivot->semester_id)
                ->updateExistingPivot($discipline->getKey(), ['resolved_semester_id' => $resolution]);
        }

        $this->recordAuditFieldChange('resolved_dependencies', $before, $this->resolvedDependenciesSummary());
    }

    /** Reprovações do semestre de referência da matrícula, para relatórios e PDFs. */
    public function getFailedDisciplineNamesAttribute(): string
    {
        return $this->namesInReferenceSemester($this->failedDisciplines);
    }

    /** Riscos de insucesso do semestre de referência da matrícula, para relatórios e PDFs. */
    public function getAtRiskDisciplineNamesAttribute(): string
    {
        return $this->namesInReferenceSemester($this->atRiskDisciplines);
    }

    /** @param  Collection<int, Discipline>  $disciplines */
    private function namesInReferenceSemester(Collection $disciplines): string
    {
        return $disciplines
            ->filter(fn (Discipline $discipline): bool => $this->semester_id === null
                || (int) $discipline->pivot->semester_id === (int) $this->semester_id)
            ->pluck('name')
            ->unique()
            ->join(', ');
    }

    /** Texto legível por semestre, para o histórico de alterações. */
    private function academicRecordsSummary(StudentCourseDisciplineCategory $category): ?string
    {
        $disciplines = $this->disciplinesByCategory($category)->orderBy('disciplines.name')->get();
        $labels = Semester::query()
            ->whereIn('id', $disciplines->pluck('pivot.semester_id')->unique())
            ->orderBy('year')
            ->orderBy('term')
            ->pluck('label', 'id');

        $summary = $labels
            ->map(fn (mixed $label, mixed $semesterId): string => "{$label}: ".$disciplines
                ->filter(fn (Discipline $discipline): bool => (int) $discipline->pivot->semester_id === (int) $semesterId)
                ->pluck('name')
                ->join(', '))
            ->implode('; ');

        return $summary === '' ? null : $summary;
    }

    private function resolvedDependenciesSummary(): ?string
    {
        $resolved = $this->failedDisciplines()
            ->wherePivotNotNull('resolved_semester_id')
            ->orderBy('disciplines.name')
            ->get();
        $labels = Semester::query()
            ->whereIn('id', $resolved->pluck('pivot.resolved_semester_id')->unique())
            ->pluck('label', 'id');

        $summary = $resolved
            ->map(fn (Discipline $discipline): string => "{$discipline->name} (aprovada em {$labels->get($discipline->pivot->resolved_semester_id)})")
            ->unique()
            ->implode('; ');

        return $summary === '' ? null : $summary;
    }

    /**
     * @throws InvalidStudentCourse
     */
    private static function ensurePersisted(Student $student, Course $course): void
    {
        if (! $student->exists) {
            throw new InvalidStudentCourse('A matrícula deve ser vinculada a um aluno persistido.');
        }

        if (! $course->exists) {
            throw new InvalidStudentCourse('A matrícula deve ser vinculada a um curso persistido.');
        }
    }

    private function disciplinesByCategory(StudentCourseDisciplineCategory $category): BelongsToMany
    {
        return $this->belongsToMany(
            Discipline::class,
            'student_course_disciplines',
            'student_course_id',
            'discipline_id',
        )
            ->withPivotValue('category', $category->value)
            ->withPivot(['semester_id', 'resolved_semester_id'])
            ->withTimestamps();
    }

    private static function nullableText(?string $value): ?string
    {
        $value = trim((string) $value);

        return $value === '' ? null : $value;
    }
}
