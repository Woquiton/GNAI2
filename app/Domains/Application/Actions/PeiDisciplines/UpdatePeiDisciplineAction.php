<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\PeiDisciplines;

use App\Domains\Domain\Models\Auth\User;
use App\Domains\Domain\Exceptions\Disciplines\InvalidDiscipline;
use App\Domains\Domain\Models\Disciplines\Discipline;
use App\Domains\Application\Data\PeiDisciplines\UpdatePeiDisciplineData;
use App\Domains\Domain\DTOs\PeiDisciplines\UpdatePeiDisciplineDTO;
use App\Domains\Domain\Exceptions\PeiDisciplines\InvalidPeiDiscipline;
use App\Domains\Domain\Models\PeiDisciplines\PeiDiscipline;
use App\Domains\Domain\Models\PeiDisciplineRevisions\PeiDisciplineRevision;
use App\Domains\Domain\Models\Peis\Pei;
use App\Domains\Domain\Exceptions\Students\InvalidStudent;
use App\Domains\Domain\Models\Teachers\Teacher;
use App\Domains\Domain\Models\Teachers\TeacherCourseDiscipline;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class UpdatePeiDisciplineAction
{
    /**
     * @throws InvalidDiscipline
     * @throws InvalidPeiDiscipline
     * @throws InvalidStudent
     * @throws ModelNotFoundException
     * @throws Throwable
     */
    public function execute(PeiDiscipline $peiDiscipline, User $user, UpdatePeiDisciplineData $data): PeiDiscipline
    {
        return DB::transaction(function () use ($peiDiscipline, $user, $data): PeiDiscipline {
            $lockedPei = Pei::query()
                ->with(['student', 'course'])
                ->lockForUpdate()
                ->findOrFail($peiDiscipline->pei_id);
            $lockedPei->student->ensureIsActive();

            $lockedPeiDiscipline = PeiDiscipline::query()
                ->lockForUpdate()
                ->where('pei_id', $lockedPei->getKey())
                ->findOrFail($peiDiscipline->getKey());

            $lockedPeiDiscipline->ensureCanBeEditedBy((int) $user->getKey(), $user->teacher_id, $user->isAdmin());

            // Um PEI finalizado continua editável: finalização é um checkpoint de
            // completude (todas as disciplinas preenchidas), não um bloqueio
            // definitivo. O histórico de revisões (PeiDisciplineRevision) é quem
            // registra o rastro de auditoria dessas mudanças pós-finalização.

            $teacher = Teacher::query()
                ->findOrFail($data->teacherId);

            $discipline = Discipline::query()
                ->findOrFail($data->disciplineId);

            $disciplineChanged = (int) $lockedPeiDiscipline->discipline_id !== (int) $discipline->getKey();
            $teacherChanged = (int) $lockedPeiDiscipline->teacher_id !== (int) $teacher->getKey();

            // Disciplina e professor só são revalidados quando mudam: uma adaptação antiga continua
            // editável mesmo depois da troca de professor ou da inativação da disciplina.
            if ($disciplineChanged) {
                $discipline->ensureIsActive();

                $peiAlreadyHasDiscipline = PeiDiscipline::query()
                    ->where('pei_id', $lockedPeiDiscipline->pei_id)
                    ->where('discipline_id', $discipline->getKey())
                    ->exists();

                if ($peiAlreadyHasDiscipline) {
                    throw new InvalidPeiDiscipline('Já existe uma adaptação para essa disciplina nesse PEI.');
                }

                $disciplineBelongsToCourse = $lockedPei->course
                    ->disciplines()
                    ->where('disciplines.id', $discipline->getKey())
                    ->exists();

                if (! $disciplineBelongsToCourse) {
                    throw new InvalidPeiDiscipline('A disciplina selecionada não faz parte do curso do aluno.');
                }
            }

            if ($disciplineChanged || $teacherChanged) {
                $teacherTeachesDiscipline = TeacherCourseDiscipline::query()
                    ->where('teacher_id', $teacher->getKey())
                    ->where('course_id', $lockedPei->course_id)
                    ->where('discipline_id', $discipline->getKey())
                    ->where('semester_id', $lockedPei->semester_id)
                    ->exists();

                if (! $teacherTeachesDiscipline) {
                    throw new InvalidPeiDiscipline('O professor selecionado não está vinculado à disciplina neste curso no semestre do PEI.');
                }
            }

            $fieldLabels = [
                'specific_objectives' => 'Objetivos específicos',
                'content_programmatic' => 'Conteúdo programático',
                'methodologies' => 'Metodologias e estratégias',
                'evaluations' => 'Processo de avaliação',
                'opinion' => 'Parecer',
                'complementary_records' => 'Registros complementares',
                'curricular_reference' => 'Referência curricular',
                'materials_and_assistive_technology' => 'Recursos didáticos e tecnologia assistiva',
                'objectives_deadline' => 'Prazo das metas/objetivos',
            ];
            $before = $lockedPeiDiscipline->only(array_keys($fieldLabels));

            $peiDisciplineDTO = new UpdatePeiDisciplineDTO(
                specificObjectives: $data->specificObjectives,
                contentProgrammatic: $data->contentProgrammatic,
                methodologies: $data->methodologies,
                evaluations: $data->evaluations,
                opinion: $data->opinion,
                complementaryRecords: $data->complementaryRecords,
                curricularReference: $data->curricularReference,
                materialsAndAssistiveTechnology: $data->materialsAndAssistiveTechnology,
                objectivesDeadline: $data->objectivesDeadline,
            );

            $lockedPeiDiscipline->revise(
                teacher: $teacher,
                discipline: $discipline,
                data: $peiDisciplineDTO,
            );

            try {
                $lockedPeiDiscipline->save();
            } catch (UniqueConstraintViolationException $exception) {
                throw new InvalidPeiDiscipline(
                    'Já existe uma adaptação para essa disciplina nesse PEI. Recarregue a página e tente novamente.',
                    previous: $exception,
                );
            }

            $changedFieldsWithLabels = collect($fieldLabels)
                ->filter(fn (string $label, string $field): bool => $before[$field] !== $lockedPeiDiscipline->{$field});

            if ($changedFieldsWithLabels->isNotEmpty()) {
                $lockedPeiDiscipline->revisions()->create([
                    'reviewed_at' => now()->toDateString(),
                    'what_changed' => 'Campo(s) alterado(s): '.$changedFieldsWithLabels->values()->implode(', ').'.',
                    'why' => PeiDisciplineRevision::AUTOMATIC_REASON,
                    'reviewer_id' => (int) $user->getKey(),
                ]);
            }

            return $lockedPeiDiscipline->load(['pei.student.person', 'teacher.person', 'discipline', 'creator']);
        });
    }
}
