<?php

declare(strict_types=1);

namespace App\UI\Controllers;

use App\Application\Actions\Courses\CreateCourseAction;
use App\Application\Actions\Courses\DeleteCourseAction;
use App\Application\Actions\Courses\RolloverCourseSemesterAction;
use App\Application\Actions\Courses\UpdateCourseAction;
use App\Application\Data\Courses\CreateCourseData;
use App\Application\Data\Courses\ListCoursesData;
use App\Application\Data\Courses\RolloverCourseSemesterData;
use App\Application\Data\Courses\UpdateCourseData;
use App\Application\Queries\Courses\CourseFormQuery;
use App\Application\Queries\Courses\CourseRolloverQuery;
use App\Application\Queries\Courses\ListCoursesQuery;
use App\Application\Queries\Courses\ShowCourseQuery;
use App\Domain\Models\Course;
use App\Domain\Models\Semester;
use App\Shared\Infrastructure\Security\RichTextSanitizer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Throwable;

final class CourseController
{
    public function index(ListCoursesData $filters, ListCoursesQuery $query, Request $request): InertiaResponse
    {
        $courses = $query->execute($filters);

        return Inertia::render(
            'Courses/Index',
            [
                'courses' => $courses,
                'filters' => [
                    'name' => $filters->name ?? '',
                    'is_active' => $filters->isActive === null ? '' : (string) (int) $filters->isActive,
                ],
                'can' => [
                    'create' => $request->user()?->can('course.create') ?? false,
                    'view' => $request->user()?->can('course.view') ?? false,
                    'delete' => $request->user()?->can('course.delete') ?? false,
                ],
            ],
        );
    }

    public function show(Course $course, ShowCourseQuery $query, Request $request): InertiaResponse
    {
        $course = $query->execute($course);

        return Inertia::render(
            'Courses/Show',
            [
                'course' => $course,
                'display' => [
                    'descriptionHtml' => RichTextSanitizer::sanitize($course->description ?: 'Nenhuma descrição informada.'),
                ],
                'can' => [
                    'update' => $request->user()?->can('course.update') ?? false,
                    'delete' => $request->user()?->can('course.delete') ?? false,
                    'rollover' => $request->user()?->can('student-course.update') ?? false,
                ],
            ],
        );
    }

    public function create(CourseFormQuery $form): InertiaResponse
    {
        return Inertia::render(
            'Courses/Create',
            $form->forCreation(),
        );
    }

    /**
     * @throws Throwable
     */
    public function store(CreateCourseData $data, CreateCourseAction $action): RedirectResponse
    {
        $action->execute($data);

        return redirect()
            ->route('specialized-educational-support.courses.index')
            ->with('success', 'Curso cadastrado com sucesso.');
    }

    public function edit(Course $course, CourseFormQuery $form): InertiaResponse
    {
        return Inertia::render(
            'Courses/Edit',
            $form->forUpdate($course),
        );
    }

    /**
     * @throws Throwable
     */
    public function update(UpdateCourseData $data, Course $course, UpdateCourseAction $action): RedirectResponse
    {
        $action->execute($course, $data);

        return redirect()
            ->route('specialized-educational-support.courses.index')
            ->with('success', 'Curso atualizado com sucesso.');
    }

    /**
     * @throws Throwable
     */
    public function destroy(Course $course, DeleteCourseAction $action): RedirectResponse
    {
        $action->execute($course);

        return redirect()
            ->route('specialized-educational-support.courses.index')
            ->with('success', 'Curso removido com sucesso.');
    }

    /** Virada de semestre: período de cada aluno ativo do curso no semestre escolhido. */
    public function rollover(Course $course, CourseRolloverQuery $query, Request $request): InertiaResponse
    {
        $semesterId = $request->integer('semestre');

        return Inertia::render(
            'Courses/Rollover',
            $query->execute($course, $semesterId > 0 ? $semesterId : null),
        );
    }

    /**
     * @throws Throwable
     */
    public function storeRollover(
        RolloverCourseSemesterData $data,
        Course $course,
        RolloverCourseSemesterAction $action,
    ): RedirectResponse {
        $registered = $action->execute($course, $data);
        $label = (string) Semester::query()->whereKey($data->semesterId)->value('label');
        $message = $registered === 1
            ? "1 aluno registrado em {$label}."
            : "{$registered} alunos registrados em {$label}.";

        return redirect()
            ->route('specialized-educational-support.courses.show', $course)
            ->with('success', $message);
    }
}
