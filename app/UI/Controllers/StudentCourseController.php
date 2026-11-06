<?php

declare(strict_types=1);

namespace App\UI\Controllers;

use App\Application\Actions\StudentCourses\CreateStudentCourseAction;
use App\Application\Actions\StudentCourses\DeleteStudentCourseAction;
use App\Application\Actions\StudentCourses\SetCurrentStudentCourseAction;
use App\Application\Actions\StudentCourses\UpdateStudentCourseAction;
use App\Application\Data\StudentCourses\CreateStudentCourseData;
use App\Application\Data\StudentCourses\ListStudentCoursesData;
use App\Application\Data\StudentCourses\UpdateStudentCourseData;
use App\Application\Queries\StudentCourses\ListStudentCoursesQuery;
use App\Application\Queries\StudentCourses\ShowStudentCourseQuery;
use App\Application\Queries\StudentCourses\StudentCourseFilterCoursesQuery;
use App\Application\Queries\StudentCourses\StudentCourseFormQuery;
use App\Domain\Models\Student;
use App\Domain\Models\StudentCourse;
use App\Shared\Infrastructure\Security\RichTextSanitizer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Throwable;

final class StudentCourseController
{
    public function index(
        ListStudentCoursesData $filters,
        Student $student,
        ListStudentCoursesQuery $query,
        StudentCourseFilterCoursesQuery $filterCourses,
        Request $request,
    ): InertiaResponse {
        $studentCourses = $query->execute($student, $filters);
        $user = $request->user();

        return Inertia::render('StudentCourses/Index', [
            'student' => $student->loadMissing('person'),
            'studentCourses' => $studentCourses,
            'courses' => collect($filterCourses->execute($student))
                ->map(static fn (mixed $name, int|string $id): array => ['value' => (string) $id, 'label' => (string) $name])
                ->values(),
            'filters' => [
                'course_id' => $filters->courseId === null ? '' : (string) $filters->courseId,
                'academic_year' => $filters->academicYear ?? '',
                'is_current' => $filters->isCurrent === null ? '' : (string) (int) $filters->isCurrent,
            ],
            'can' => [
                'create' => $user?->can('student-course.create') ?? false,
                'view' => $user?->can('student-course.view') ?? false,
                'delete' => $user?->can('student-course.delete') ?? false,
            ],
        ]);
    }

    public function show(
        StudentCourse $studentCourse,
        ShowStudentCourseQuery $query,
        Request $request,
    ): InertiaResponse {
        $studentCourse = $query->execute($studentCourse);
        $user = $request->user();

        return Inertia::render('StudentCourses/Show', [
            'studentCourse' => $studentCourse,
            'academicHistory' => $query->academicHistory($studentCourse),
            'pendingDependencies' => $query->pendingDependencies($studentCourse),
            'display' => [
                'courseDescriptionHtml' => RichTextSanitizer::sanitize(
                    (string) ($studentCourse->course?->description ?: 'Não informado'),
                ),
                'schoolAttendanceStatusHtml' => RichTextSanitizer::sanitize(
                    (string) ($studentCourse->school_attendance_status ?: 'Não informada.'),
                ),
            ],
            'can' => [
                'update' => $user?->can('student-course.update') ?? false,
                'delete' => $user?->can('student-course.delete') ?? false,
            ],
        ]);
    }

    public function create(Student $student, StudentCourseFormQuery $form): InertiaResponse
    {
        return Inertia::render(
            'StudentCourses/Create',
            $form->forCreation($student),
        );
    }

    /**
     * @throws Throwable
     */
    public function store(
        CreateStudentCourseData $data,
        Student $student,
        CreateStudentCourseAction $action,
    ): RedirectResponse {
        $action->execute($student, $data);

        return redirect()
            ->route('specialized-educational-support.students.show', [
                'student' => $student,
                'tab' => 'academic-data',
            ])
            ->with('success', 'Matrícula realizada com sucesso.');
    }

    public function edit(StudentCourse $studentCourse, StudentCourseFormQuery $form): InertiaResponse
    {
        return Inertia::render(
            'StudentCourses/Edit',
            $form->forUpdate($studentCourse),
        );
    }

    /**
     * @throws Throwable
     */
    public function update(
        UpdateStudentCourseData $data,
        StudentCourse $studentCourse,
        UpdateStudentCourseAction $action,
    ): RedirectResponse {
        $studentCourse = $action->execute($studentCourse, $data);

        return redirect()
            ->route('specialized-educational-support.students.show', [
                'student' => $studentCourse->student_id,
                'tab' => 'academic-data',
            ])
            ->with('success', 'Dados da matrícula atualizados.');
    }

    /**
     * @throws Throwable
     */
    public function destroy(StudentCourse $studentCourse, DeleteStudentCourseAction $action): RedirectResponse
    {
        $student = $studentCourse->student_id;

        $action->execute($studentCourse);

        return redirect()
            ->route('specialized-educational-support.students.show', [
                'student' => $student,
                'tab' => 'academic-data',
            ])
            ->with('success', 'Registro de histórico removido.');
    }

    /**
     * @throws Throwable
     */
    public function makeCurrent(
        StudentCourse $studentCourse,
        SetCurrentStudentCourseAction $action,
    ): RedirectResponse {
        $studentCourse = $action->execute($studentCourse);

        return redirect()
            ->route('specialized-educational-support.students.show', [
                'student' => $studentCourse->student_id,
                'tab' => 'academic-data',
            ])
            ->with('success', 'Curso definido como atual com sucesso.');
    }
}
