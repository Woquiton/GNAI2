<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\UI\Controllers;

use App\Domains\Inclusion\Application\Actions\StudentDeficiencies\CreateStudentDeficiencyAction;
use App\Domains\Inclusion\Application\Actions\StudentDeficiencies\DeleteStudentDeficiencyAction;
use App\Domains\Inclusion\Application\Actions\StudentDeficiencies\UpdateStudentDeficiencyAction;
use App\Domains\Inclusion\Application\Data\StudentDeficiencies\CreateStudentDeficiencyData;
use App\Domains\Inclusion\Application\Data\StudentDeficiencies\UpdateStudentDeficiencyData;
use App\Domains\Inclusion\Application\Queries\StudentDeficiencies\ShowStudentDeficiencyQuery;
use App\Domains\Inclusion\Application\Queries\StudentDeficiencies\StudentDeficiencyFormQuery;
use App\Domains\Inclusion\Domain\Enums\DeficiencySeverity;
use App\Domains\Inclusion\Domain\Models\Student;
use App\Domains\Inclusion\Domain\Models\StudentDeficiency;
use App\Shared\Infrastructure\Security\RichTextSanitizer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Throwable;

final class StudentDeficiencyController
{
    public function show(
        Student $student,
        StudentDeficiency $student_deficiency,
        ShowStudentDeficiencyQuery $query,
        Request $request,
    ): InertiaResponse {
        abort_if((int) $student_deficiency->student_id !== (int) $student->getKey(), 404);

        $deficiency = $query->execute($student_deficiency);
        $severity = DeficiencySeverity::tryFrom((string) $deficiency->severity);
        $user = $request->user();

        return Inertia::render('Inclusion/StudentDeficiencies/Show', [
            'deficiency' => [
                ...$deficiency->toArray(),
                'severity_label' => $severity?->label(),
                'severity_color' => $severity?->color(),
                'notes_html' => RichTextSanitizer::sanitize((string) ($deficiency->notes ?: 'Nenhuma observação registrada.')),
            ],
            'student' => $student->loadMissing('person'),
            'can' => [
                'update' => $user?->can('student-deficiency.update') ?? false,
                'delete' => $user?->can('student-deficiency.delete') ?? false,
            ],
        ]);
    }

    public function create(Student $student, StudentDeficiencyFormQuery $form): InertiaResponse
    {
        return Inertia::render(
            'Inclusion/StudentDeficiencies/Create',
            $form->forCreation($student),
        );
    }

    /**
     * @throws Throwable
     */
    public function store(
        CreateStudentDeficiencyData $data,
        Student $student,
        CreateStudentDeficiencyAction $action,
    ): RedirectResponse {
        $action->execute($student, $data);

        return redirect()
            ->route('specialized-educational-support.students.show', [
                'student' => $student,
                'tab' => 'support-profiles',
            ])
            ->with('success', 'Deficiência vinculada com sucesso.');
    }

    public function edit(
        Student $student,
        StudentDeficiency $student_deficiency,
        StudentDeficiencyFormQuery $form,
    ): InertiaResponse {
        abort_if((int) $student_deficiency->student_id !== (int) $student->getKey(), 404);

        return Inertia::render(
            'Inclusion/StudentDeficiencies/Edit',
            $form->forUpdate($student, $student_deficiency),
        );
    }

    /**
     * @throws Throwable
     */
    public function update(
        UpdateStudentDeficiencyData $data,
        Student $student,
        StudentDeficiency $student_deficiency,
        UpdateStudentDeficiencyAction $action,
    ): RedirectResponse {
        abort_if((int) $student_deficiency->student_id !== (int) $student->getKey(), 404);

        $action->execute($student_deficiency, $data);

        return redirect()
            ->route('specialized-educational-support.students.show', [
                'student' => $student,
                'tab' => 'support-profiles',
            ])
            ->with('success', 'Informações da deficiência atualizadas.');
    }

    /**
     * @throws Throwable
     */
    public function destroy(
        Student $student,
        StudentDeficiency $student_deficiency,
        DeleteStudentDeficiencyAction $action,
    ): RedirectResponse {
        abort_if((int) $student_deficiency->student_id !== (int) $student->getKey(), 404);

        $action->execute($student_deficiency);

        return redirect()
            ->route('specialized-educational-support.students.show', [
                'student' => $student,
                'tab' => 'support-profiles',
            ])
            ->with('success', 'Vínculo removido com sucesso.');
    }
}
