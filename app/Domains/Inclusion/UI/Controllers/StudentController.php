<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\UI\Controllers;

use App\Domains\Auth\Domain\Models\User;
use App\Domains\Inclusion\Application\Actions\Students\CreateStudentAction;
use App\Domains\Inclusion\Application\Actions\Students\DeleteStudentAction;
use App\Domains\Inclusion\Application\Actions\Students\UpdateStudentAction;
use App\Domains\Inclusion\Application\Data\Students\CreateStudentData;
use App\Domains\Inclusion\Application\Data\Students\ListStudentsData;
use App\Domains\Inclusion\Application\Data\Students\UpdateStudentData;
use App\Domains\Inclusion\Application\Queries\Students\ListStudentsQuery;
use App\Domains\Inclusion\Application\Queries\Students\ShowStudentQuery;
use App\Domains\Inclusion\Application\Queries\Students\StudentAeeEvaluationsQuery;
use App\Domains\Inclusion\Application\Queries\Students\StudentCaseStudiesQuery;
use App\Domains\Inclusion\Application\Queries\Students\StudentFilterOptionsQuery;
use App\Domains\Inclusion\Application\Queries\Students\StudentFormQuery;
use App\Domains\Inclusion\Application\Queries\Students\StudentPaeesQuery;
use App\Domains\Inclusion\Application\Queries\Students\StudentPdfQuery;
use App\Domains\Inclusion\Application\Queries\Students\StudentPedagogicalRecordsQuery;
use App\Domains\Inclusion\Domain\Enums\StudentDocumentType;
use App\Domains\Inclusion\Domain\Models\Student;
use App\Domains\Inclusion\UI\Presenters\StudentPagePresenter;
use App\Shared\Infrastructure\Pdf\PdfPageNumberer;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Throwable;

final class StudentController
{
    public function __construct(private readonly StudentPagePresenter $presenter) {}

    public function index(ListStudentsData $filters, ListStudentsQuery $query, StudentFilterOptionsQuery $options, Request $request): InertiaResponse
    {
        $user = $request->user();
        $teacherId = $user instanceof User ? $user->teacher_id : null;
        $students = $query->execute($filters, $teacherId);
        $students->through(fn (Student $student): array => $this->presenter->student($student, $request));

        return Inertia::render(
            'Inclusion/Students/Index',
            compact('students') + $options->execute() + $this->presenter->shared($request) + [
                'filters' => $request->only(['name', 'phone', 'email', 'status', 'course_id', 'deficiency_id', 'registration', 'per_page']),
            ],
        );
    }

    public function show(
        Student $student,
        ShowStudentQuery $showStudent,
        StudentAeeEvaluationsQuery $aeeEvaluationsQuery,
        StudentPedagogicalRecordsQuery $pedagogicalRecordsQuery,
        StudentCaseStudiesQuery $caseStudiesQuery,
        StudentPaeesQuery $paeesQuery,
        Request $request,
    ): InertiaResponse {
        $user = $request->user();
        $authenticatedUser = $user instanceof User ? $user : null;
        $student = $showStudent->execute($student);
        $aeeEvaluations = $aeeEvaluationsQuery->execute(
            $student,
            $authenticatedUser,
            limit: null,
        );
        $pedagogicalRecords = $pedagogicalRecordsQuery->execute(
            $student,
            $authenticatedUser,
            limit: null,
        );
        $this->presenter->markManageableAeeEvaluations($aeeEvaluations, $authenticatedUser);
        $this->presenter->markManageablePedagogicalRecords($pedagogicalRecords, $authenticatedUser);
        $caseStudies = $this->presenter->caseStudies($caseStudiesQuery->execute($student));
        $paees = $this->presenter->paees($paeesQuery->execute($student));
        $hasLaudo = $student->documents()
            ->where('type', StudentDocumentType::TECHNICAL_REPORT->value)
            ->exists();
        $activeTab = $request->string('tab')->toString();

        return Inertia::render(
            'Inclusion/Students/Show',
            ['student' => $this->presenter->student($student, $request)]
                + compact('aeeEvaluations', 'pedagogicalRecords', 'caseStudies', 'paees', 'activeTab')
                + ['statusPanel' => $this->presenter->statusPanel($student, $hasLaudo)]
                + $this->presenter->shared($request),
        );
    }

    public function create(StudentFormQuery $form, Request $request): InertiaResponse
    {
        return Inertia::render(
            'Inclusion/Students/Create',
            $form->forCreation() + $this->presenter->shared($request),
        );
    }

    /**
     * @throws Throwable
     */
    public function store(CreateStudentData $data, CreateStudentAction $action): RedirectResponse
    {
        $student = $action->execute($data);

        return redirect()
            ->route('specialized-educational-support.students.show', $student)
            ->with('success', 'Aluno cadastrado com sucesso.');
    }

    public function edit(Student $student, StudentFormQuery $form, Request $request): InertiaResponse
    {
        $props = $form->forUpdate($student);
        $props['student'] = $this->presenter->student($student, $request);

        return Inertia::render(
            'Inclusion/Students/Edit',
            $props + $this->presenter->shared($request),
        );
    }

    /**
     * @throws Throwable
     */
    public function update(UpdateStudentData $data, Student $student, UpdateStudentAction $action): RedirectResponse
    {
        $student = $action->execute($student, $data);

        return redirect()
            ->route('specialized-educational-support.students.show', $student)
            ->with('success', 'Aluno atualizado com sucesso.');
    }

    /**
     * @throws Throwable
     */
    public function destroy(Student $student, DeleteStudentAction $action): RedirectResponse
    {
        $action->execute($student);

        return redirect()
            ->route('specialized-educational-support.students.index')
            ->with('success', 'Aluno removido com sucesso.');
    }

    public function pdf(
        Student $student,
        StudentPdfQuery $query,
        StudentAeeEvaluationsQuery $aeeEvaluationsQuery,
        StudentPedagogicalRecordsQuery $pedagogicalRecordsQuery,
        Request $request,
    ): Response {
        $student = $query->execute($student);

        $user = $request->user();
        $aeeEvaluations = $user instanceof User ? $aeeEvaluationsQuery->history($student, $user)->reverse()->values() : collect();
        $pedagogicalRecords = $user instanceof User ? $pedagogicalRecordsQuery->history($student, $user)->reverse()->values() : collect();

        $pdf = Pdf::loadView(
            'pages.inclusion.students.pdf',
            compact('student', 'aeeEvaluations', 'pedagogicalRecords'),
        );

        PdfPageNumberer::apply($pdf);

        return $pdf->stream("ficha-aluno-{$student->registration}.pdf");
    }
}
