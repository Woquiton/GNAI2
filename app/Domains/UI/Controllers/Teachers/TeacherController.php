<?php

declare(strict_types=1);

namespace App\Domains\UI\Controllers\Teachers;

use App\Domains\Application\Actions\Teachers\CopyTeacherCourseDisciplinesAction;
use App\Domains\Application\Actions\Teachers\CreateTeacherAction;
use App\Domains\Application\Actions\Teachers\DeleteTeacherAction;
use App\Domains\Application\Actions\Teachers\UpdateTeacherAction;
use App\Domains\Application\Actions\Teachers\UpdateTeacherDisciplinesAction;
use App\Domains\Application\Data\Teachers\CopyTeacherDisciplinesData;
use App\Domains\Application\Data\Teachers\CreateTeacherData;
use App\Domains\Application\Data\Teachers\ListTeachersData;
use App\Domains\Application\Data\Teachers\UpdateTeacherData;
use App\Domains\Application\Data\Teachers\UpdateTeacherDisciplinesData;
use App\Domains\Application\Queries\Semesters\CurrentSemesterQuery;
use App\Domains\Application\Queries\Teachers\ListTeachersQuery;
use App\Domains\Application\Queries\Teachers\PreviousAssignmentSemesterQuery;
use App\Domains\Application\Queries\Teachers\ShowTeacherQuery;
use App\Domains\Application\Queries\Teachers\TeacherDisciplinesFormQuery;
use App\Domains\Application\Queries\Teachers\TeacherFormQuery;
use App\Domains\Domain\Models\Semesters\Semester;
use App\Domains\Domain\Models\Teachers\Teacher;
use App\Shared\Infrastructure\Security\RichTextSanitizer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Throwable;

final class TeacherController
{
    public function index(
        ListTeachersData $filters,
        ListTeachersQuery $query,
        CurrentSemesterQuery $currentSemesterQuery,
        PreviousAssignmentSemesterQuery $previousSemesterQuery,
        Request $request,
    ): InertiaResponse {
        $teachers = $query->execute($filters);
        $currentSemester = $currentSemesterQuery->execute();
        $copySource = $currentSemester instanceof Semester
            ? $previousSemesterQuery->execute($currentSemester)
            : null;
        $teachers->through(static function (Teacher $teacher): Teacher {
            $teacher->person?->append('photo_url');

            return $teacher;
        });

        return Inertia::render(
            'Teachers/Index',
            [
                'teachers' => $teachers,
                'filters' => [
                    'name' => $filters->name ?? '',
                    'email' => $filters->email ?? '',
                    'registration' => $filters->registration ?? '',
                ],
                'can' => [
                    'create' => $request->user()?->can('teacher.create') ?? false,
                    'view' => $request->user()?->can('teacher.view') ?? false,
                    'update' => $request->user()?->can('teacher.update') ?? false,
                    'delete' => $request->user()?->can('teacher.delete') ?? false,
                ],
                // Cópia dos vínculos de todos os professores para o semestre atual.
                'assignmentCopy' => [
                    'target' => $currentSemester?->only(['id', 'label']),
                    'source' => $copySource?->only(['id', 'label']),
                ],
            ],
        );
    }

    public function show(Teacher $teacher, ShowTeacherQuery $query, Request $request): InertiaResponse
    {
        $teacher = $query->execute($teacher);
        $teacher->person?->append('photo_url');
        $isSuperAdmin = $request->user()?->isSuperAdmin() ?? false;

        return Inertia::render(
            'Teachers/Show',
            [
                'teacher' => $teacher,
                'display' => [
                    'createdAt' => $teacher->created_at?->format('d/m/Y'),
                    'addressHtml' => RichTextSanitizer::sanitize($teacher->person?->address ?? '', decodeEntities: false),
                ],
                'impersonationUserId' => $isSuperAdmin
                    ? $teacher->user()->where('is_super_admin', false)->value('id')
                    : null,
                'can' => [
                    'update' => $request->user()?->can('teacher.update') ?? false,
                    'delete' => $request->user()?->can('teacher.delete') ?? false,
                ],
            ],
        );
    }

    public function create(TeacherFormQuery $form): InertiaResponse
    {
        return Inertia::render(
            'Teachers/Create',
            $form->forCreation(),
        );
    }

    /**
     * @throws Throwable
     */
    public function store(CreateTeacherData $data, CreateTeacherAction $action): RedirectResponse
    {
        $action->execute($data);

        return redirect()
            ->route('specialized-educational-support.teachers.index')
            ->with('success', $data->password === null
                ? 'Professor cadastrado com sucesso. O link para definição da senha foi enviado por e-mail.'
                : 'Professor cadastrado com sucesso. O acesso já pode ser feito com a senha definida.');
    }

    public function edit(Teacher $teacher, TeacherFormQuery $form): InertiaResponse
    {
        return Inertia::render(
            'Teachers/Edit',
            $form->forUpdate($teacher),
        );
    }

    /**
     * @throws Throwable
     */
    public function update(UpdateTeacherData $data, Teacher $teacher, UpdateTeacherAction $action, Request $request): RedirectResponse
    {
        $action->execute($teacher, $data, $request->user());

        return redirect()
            ->route('specialized-educational-support.teachers.index')
            ->with('success', 'Professor atualizado com sucesso.');
    }

    /**
     * @throws Throwable
     */
    public function destroy(Teacher $teacher, DeleteTeacherAction $action): RedirectResponse
    {
        $action->execute($teacher);

        return redirect()
            ->route('specialized-educational-support.teachers.index')
            ->with('success', 'Professor removido com sucesso.');
    }

    public function disciplines(Teacher $teacher, TeacherDisciplinesFormQuery $query, Request $request): InertiaResponse
    {
        $semesterId = $request->integer('semestre');

        return Inertia::render(
            'Teachers/Disciplines',
            $query->execute($teacher, $semesterId > 0 ? $semesterId : null),
        );
    }

    /**
     * @throws Throwable
     */
    public function updateDisciplines(
        UpdateTeacherDisciplinesData $data,
        Teacher $teacher,
        UpdateTeacherDisciplinesAction $action,
    ): RedirectResponse {
        $action->execute($teacher, $data);

        return redirect()
            ->route('specialized-educational-support.teachers.show', $teacher)
            ->with('success', 'Matriz curricular atualizada com sucesso!');
    }

    /**
     * Copia para o semestre informado os vínculos do professor no semestre anterior.
     *
     * @throws Throwable
     */
    public function copyDisciplines(
        CopyTeacherDisciplinesData $data,
        Teacher $teacher,
        CopyTeacherCourseDisciplinesAction $action,
    ): RedirectResponse {
        $target = Semester::query()->findOrFail($data->semesterId);
        $result = $action->execute($target, $teacher);

        return redirect()
            ->route('specialized-educational-support.teachers.disciplines', [
                'teacher' => $teacher,
                'semestre' => $target->getKey(),
            ])
            ->with('success', $this->copyMessage($result['created'], $result['source'], $target));
    }

    /**
     * Copia para o semestre informado os vínculos de todos os professores no semestre anterior.
     *
     * @throws Throwable
     */
    public function copyAllDisciplines(
        CopyTeacherDisciplinesData $data,
        CopyTeacherCourseDisciplinesAction $action,
    ): RedirectResponse {
        $target = Semester::query()->findOrFail($data->semesterId);
        $result = $action->execute($target);

        return redirect()
            ->route('specialized-educational-support.teachers.index')
            ->with('success', $this->copyMessage($result['created'], $result['source'], $target));
    }

    private function copyMessage(int $created, Semester $source, Semester $target): string
    {
        if ($created === 0) {
            return "Os vínculos de {$source->label} já estavam em {$target->label}. Nada foi copiado.";
        }

        $label = $created === 1 ? '1 vínculo copiado' : "{$created} vínculos copiados";

        return "{$label} de {$source->label} para {$target->label}.";
    }
}
