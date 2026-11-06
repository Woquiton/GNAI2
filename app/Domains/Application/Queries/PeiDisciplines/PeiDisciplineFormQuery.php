<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\PeiDisciplines;

use App\Domains\Domain\Models\Auth\User;
use App\Domains\Domain\Models\Disciplines\Discipline;
use App\Domains\Domain\Models\PeiDisciplines\PeiDiscipline;
use App\Domains\Domain\Exceptions\Peis\InvalidPei;
use App\Domains\Domain\Models\Peis\Pei;
use App\Domains\Application\Queries\StudentCourses\StudentCourseDependenciesQuery;
use App\Domains\Domain\Models\StudentCourses\StudentCourse;
use App\Domains\Domain\Exceptions\Students\InvalidStudent;
use App\Domains\Domain\Models\Teachers\Teacher;
use Illuminate\Database\Eloquent\Collection;

final readonly class PeiDisciplineFormQuery
{
    public function __construct(
        private StudentCourseDependenciesQuery $dependencies,
    ) {}

    /**
     * @return array<string, mixed>
     *
     * @throws InvalidPei
     * @throws InvalidStudent
     */
    public function forCreation(Pei $pei): array
    {
        $pei->loadMissing(['student', 'course.disciplines', 'semester']);
        $pei->student->ensureIsActive();

        if ($pei->is_finished) {
            throw new InvalidPei('Não é possível adicionar disciplinas a um PEI finalizado.');
        }

        $alreadyAssignedDisciplineIds = PeiDiscipline::query()
            ->where('pei_id', $pei->getKey())
            ->pluck('discipline_id');

        $studentCourse = $this->studentCourse($pei);
        $studentPeriod = $studentCourse?->coursePeriodIn((int) $pei->semester_id);
        // Dependências: reprovações de semestres anteriores ao do PEI ainda não aprovadas.
        $dependencies = $studentCourse instanceof StudentCourse && $pei->semester !== null
            ? $this->dependencies->execute($studentCourse, $pei->semester)
                ->reject(fn (array $dependency): bool => $dependency['resolved'])
                ->keyBy('discipline_id')
            : collect();
        $isSuggested = fn (Discipline $discipline): bool => $dependencies->has($discipline->getKey())
            || ($studentPeriod !== null && (int) $discipline->pivot->course_period === $studentPeriod);

        // As disciplinas do período do aluno e as dependências vêm primeiro e chegam sugeridas.
        $disciplines = $pei->course->disciplines
            ->reject(fn (Discipline $discipline): bool => $alreadyAssignedDisciplineIds->contains($discipline->getKey()))
            ->sortBy(fn (Discipline $discipline): array => [
                $isSuggested($discipline) ? 0 : 1,
                $discipline->pivot->course_period ?? PHP_INT_MAX,
                $discipline->name,
            ])
            ->values();

        // Cada disciplina lista só os professores vinculados a ela neste curso no semestre do PEI.
        return [
            'pei' => ['id' => (int) $pei->getKey()],
            'semesterLabel' => $pei->semester?->label,
            'studentPeriod' => $studentPeriod,
            'disciplines' => $disciplines
                ->map(fn (Discipline $discipline): array => [
                    'id' => (int) $discipline->getKey(),
                    'name' => (string) $discipline->name,
                    'course_period' => $discipline->pivot->course_period === null
                        ? null
                        : (int) $discipline->pivot->course_period,
                    'suggested' => $isSuggested($discipline),
                    // Semestre da reprovação, quando a disciplina é dependência pendente.
                    'dependency_semester_label' => $dependencies->get($discipline->getKey())['failed_semester_label'] ?? null,
                    'teachers' => Teacher::query()
                        ->whereHas('courseDisciplines', function ($query) use ($pei, $discipline): void {
                            $query->where('course_id', $pei->course_id)
                                ->where('discipline_id', $discipline->getKey())
                                ->where('semester_id', $pei->semester_id);
                        })
                        ->with('person')
                        ->orderBy('id')
                        ->get()
                        ->map(fn (Teacher $teacher): array => [
                            'value' => (string) $teacher->getKey(),
                            'label' => (string) ($teacher->person?->name ?? ''),
                        ])
                        ->values()
                        ->all(),
                ])
                ->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     *
     * @throws InvalidStudent
     */
    public function forUpdate(Pei $pei, PeiDiscipline $peiDiscipline, User $user): array
    {
        $pei->loadMissing(['student', 'course.disciplines']);
        $pei->student->ensureIsActive();
        $peiDiscipline->loadMissing(['teacher.person', 'discipline']);
        $peiDiscipline->ensureCanBeEditedBy((int) $user->getKey(), $user->teacher_id, $user->isAdmin());

        // Um PEI finalizado continua editável por disciplina (ver
        // UpdatePeiDisciplineAction); apenas adicionar/remover disciplinas
        // inteiras (mudança estrutural) permanece bloqueado após finalizado.
        return [
            'pei' => $pei,
            'peiDiscipline' => $peiDiscipline,
            'teachers' => $this->teachers($pei, $peiDiscipline),
            'disciplines' => $this->disciplines($pei, $peiDiscipline),
        ];
    }

    /** Matrícula do aluno no curso do PEI. */
    private function studentCourse(Pei $pei): ?StudentCourse
    {
        return StudentCourse::query()
            ->where('student_id', $pei->student_id)
            ->where('course_id', $pei->course_id)
            ->first();
    }

    /**
     * Professores vinculados ao curso no semestre do PEI (Professores > Disciplinas), mais o
     * responsável atual, mesmo que ele não tenha mais o vínculo.
     *
     * @return Collection<int, Teacher>
     */
    private function teachers(Pei $pei, PeiDiscipline $peiDiscipline): Collection
    {
        return Teacher::query()
            ->where(fn ($query) => $query
                ->whereHas('courseDisciplines', function ($assignments) use ($pei): void {
                    $assignments->where('course_id', $pei->course_id)
                        ->where('semester_id', $pei->semester_id);
                })
                ->orWhereKey($peiDiscipline->teacher_id))
            ->with('person')
            ->orderBy('id')
            ->get();
    }

    /**
     * Disciplinas da matriz do curso, mais a disciplina atual da adaptação.
     *
     * @return Collection<int, Discipline>
     */
    private function disciplines(Pei $pei, PeiDiscipline $peiDiscipline): Collection
    {
        return Discipline::query()
            ->where(fn ($query) => $query
                ->whereIn('id', $pei->course->disciplines->modelKeys())
                ->orWhereKey($peiDiscipline->discipline_id))
            ->orderBy('name')
            ->get();
    }
}
