<?php

declare(strict_types=1);

namespace App\Domains\SpecializedEducationalSupport\Application\Queries\PeiDisciplines;

use App\Domains\Auth\Domain\Models\User;
use App\Domains\SpecializedEducationalSupport\Domain\Exceptions\InvalidPei;
use App\Domains\SpecializedEducationalSupport\Domain\Exceptions\InvalidStudent;
use App\Domains\SpecializedEducationalSupport\Domain\Models\Discipline;
use App\Domains\SpecializedEducationalSupport\Domain\Models\Pei;
use App\Domains\SpecializedEducationalSupport\Domain\Models\PeiDiscipline;
use App\Domains\SpecializedEducationalSupport\Domain\Models\Teacher;
use Illuminate\Database\Eloquent\Collection;

final class PeiDisciplineFormQuery
{
    /**
     * @return array<string, mixed>
     *
     * @throws InvalidPei
     * @throws InvalidStudent
     */
    public function forCreation(Pei $pei): array
    {
        $pei->loadMissing(['student', 'course.disciplines']);
        $pei->student->ensureIsActive();

        if ($pei->is_finished) {
            throw new InvalidPei('Não é possível adicionar disciplinas a um PEI finalizado.');
        }

        $alreadyAssignedDisciplineIds = PeiDiscipline::query()
            ->where('pei_id', $pei->getKey())
            ->pluck('discipline_id');

        $disciplines = $pei->course->disciplines
            ->reject(fn (Discipline $discipline): bool => $alreadyAssignedDisciplineIds->contains($discipline->getKey()))
            ->values();

        $teachers = $this->teachers($pei);

        $teachersByDiscipline = $disciplines->mapWithKeys(function (Discipline $discipline) use ($pei): array {
            $eligible = Teacher::query()
                ->whereHas('courseDisciplines', function ($query) use ($pei, $discipline): void {
                    $query->where('course_id', $pei->course_id)
                        ->where('discipline_id', $discipline->getKey());
                })
                ->with('person')
                ->orderBy('id')
                ->get();

            return [$discipline->getKey() => $eligible];
        });

        return [
            'pei' => $pei,
            'teachers' => $teachers,
            'disciplines' => $disciplines,
            'teachersByDiscipline' => $teachersByDiscipline,
        ];
    }

    /**
     * @return array<string, mixed>
     *
     * @throws InvalidStudent
     */
    public function forUpdate(Pei $pei, PeiDiscipline $peiDiscipline, User $user): array
    {
        $pei->loadMissing('student');
        $pei->student->ensureIsActive();
        $peiDiscipline->loadMissing(['teacher.person', 'discipline']);
        $peiDiscipline->ensureCanBeEditedBy((int) $user->getKey(), $user->teacher_id);

        // Um PEI finalizado continua editável por disciplina (ver
        // UpdatePeiDisciplineAction); apenas adicionar/remover disciplinas
        // inteiras (mudança estrutural) permanece bloqueado após finalizado.

        return [
            'pei' => $pei,
            'peiDiscipline' => $peiDiscipline,
            'teachers' => $this->teachers($pei),
            'disciplines' => Discipline::query()->orderBy('name')->get(),
        ];
    }

    /**
     * @return Collection<int, Teacher>
     */
    private function teachers(Pei $pei): Collection
    {
        // A fonte real de "professor dá aula nesse curso" é a matriz
        // curricular (teacher_course_disciplines, mantida pela tela de
        // Professores > Disciplinas). A tabela teacher_courses não tem
        // nenhuma tela que a mantenha, então um professor pode estar
        // corretamente cadastrado na matriz e ainda assim não aparecer
        // aqui se ela for usada como fonte — por isso não é mais usada.
        return Teacher::query()
            ->whereHas('courseDisciplines', function ($query) use ($pei): void {
                $query->where('course_id', $pei->course_id);
            })
            ->with('person')
            ->orderBy('id')
            ->get();
    }
}
