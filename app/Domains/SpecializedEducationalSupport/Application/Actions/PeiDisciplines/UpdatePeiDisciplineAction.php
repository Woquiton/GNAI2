<?php

declare(strict_types=1);

namespace App\Domains\SpecializedEducationalSupport\Application\Actions\PeiDisciplines;

use App\Domains\Auth\Domain\Models\User;
use App\Domains\SpecializedEducationalSupport\Application\Data\PeiDisciplines\UpdatePeiDisciplineData;
use App\Domains\SpecializedEducationalSupport\Domain\DTOs\PeiDisciplines\UpdatePeiDisciplineDTO;
use App\Domains\SpecializedEducationalSupport\Domain\Exceptions\InvalidDiscipline;
use App\Domains\SpecializedEducationalSupport\Domain\Exceptions\InvalidPeiDiscipline;
use App\Domains\SpecializedEducationalSupport\Domain\Exceptions\InvalidStudent;
use App\Domains\SpecializedEducationalSupport\Domain\Models\Discipline;
use App\Domains\SpecializedEducationalSupport\Domain\Models\Pei;
use App\Domains\SpecializedEducationalSupport\Domain\Models\PeiDiscipline;
use App\Domains\SpecializedEducationalSupport\Domain\Models\Teacher;
use App\Domains\SpecializedEducationalSupport\Domain\Models\TeacherCourseDiscipline;
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

            $lockedPeiDiscipline->ensureCanBeEditedBy((int) $user->getKey(), $user->teacher_id);

            // Um PEI finalizado continua editável: finalização é um checkpoint de
            // completude (todas as disciplinas preenchidas), não um bloqueio
            // definitivo. O histórico de revisões (PeiDisciplineRevision) é quem
            // registra o rastro de auditoria dessas mudanças pós-finalização.

            $teacher = Teacher::query()
                ->findOrFail($data->teacherId);

            $discipline = Discipline::query()
                ->findOrFail($data->disciplineId);
            $discipline->ensureIsActive();

            if ((int) $lockedPeiDiscipline->discipline_id !== (int) $discipline->getKey()) {
                $peiAlreadyHasDiscipline = PeiDiscipline::query()
                    ->where('pei_id', $lockedPeiDiscipline->pei_id)
                    ->where('discipline_id', $discipline->getKey())
                    ->exists();

                if ($peiAlreadyHasDiscipline) {
                    throw new InvalidPeiDiscipline('Já existe uma adaptação para essa disciplina nesse PEI.');
                }
            }

            $disciplineBelongsToCourse = $lockedPei->course
                ->disciplines()
                ->where('disciplines.id', $discipline->getKey())
                ->exists();

            if (! $disciplineBelongsToCourse) {
                throw new InvalidPeiDiscipline('A disciplina selecionada não faz parte do curso do aluno.');
            }

            $teacherBelongsToCourseAndDiscipline = TeacherCourseDiscipline::query()
                ->where('teacher_id', $teacher->getKey())
                ->where('course_id', $lockedPei->course_id)
                ->where('discipline_id', $discipline->getKey())
                ->exists();

            if (! $teacherBelongsToCourseAndDiscipline) {
                throw new InvalidPeiDiscipline('O professor selecionado não está vinculado à disciplina neste curso.');
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
                    'why' => 'Revisão registrada automaticamente ao salvar a edição da adaptação.',
                    'reviewer_id' => (int) $user->getKey(),
                ]);
            }

            return $lockedPeiDiscipline->load(['pei.student.person', 'teacher.person', 'discipline', 'creator']);
        });
    }
}
