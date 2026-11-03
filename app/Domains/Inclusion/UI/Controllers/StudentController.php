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
use App\Domains\Inclusion\Application\Queries\Semesters\CurrentSemesterQuery;
use App\Domains\Inclusion\Application\Queries\Students\ListStudentsQuery;
use App\Domains\Inclusion\Application\Queries\Students\ShowStudentQuery;
use App\Domains\Inclusion\Application\Queries\Students\StudentAeeEvaluationsQuery;
use App\Domains\Inclusion\Application\Queries\Students\StudentCaseStudiesQuery;
use App\Domains\Inclusion\Application\Queries\Students\StudentFilterOptionsQuery;
use App\Domains\Inclusion\Application\Queries\Students\StudentFormQuery;
use App\Domains\Inclusion\Application\Queries\Students\StudentLoansQuery;
use App\Domains\Inclusion\Application\Queries\Students\StudentPaeesQuery;
use App\Domains\Inclusion\Application\Queries\Students\StudentPdfQuery;
use App\Domains\Inclusion\Application\Queries\Students\StudentPedagogicalRecordsQuery;
use App\Domains\Inclusion\Domain\Enums\StudentDocumentType;
use App\Domains\Inclusion\Domain\Models\Loan;
use App\Domains\Inclusion\Domain\Models\Student;
use App\Domains\Inclusion\UI\Presenters\LoanPresenter;
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
                'filters' => $request->only(['name', 'phone', 'email', 'status', 'follow_up_type', 'course_id', 'deficiency_id', 'registration', 'per_page']),
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
        StudentLoansQuery $loansQuery,
        LoanPresenter $loanPresenter,
        CurrentSemesterQuery $currentSemesterQuery,
        Request $request,
    ): InertiaResponse {
        $user = $request->user();
        $authenticatedUser = $user instanceof User ? $user : null;
        $requestedTab = $request->string('tab')->toString();
        $availableTabs = [
            'personal-data',
            'academic-data',
            'support-profiles',
            'guardians',
            'case-studies',
            'paees',
            'peis',
            'documents',
            'aee-attendance',
            'pedagogical-attendance',
            'loans',
        ];
        $activeTab = in_array($requestedTab, $availableTabs, true)
            ? $requestedTab
            : 'personal-data';
        $tabProp = static fn (string $tab, callable $resolver): mixed => $activeTab === $tab
            ? $resolver
            : Inertia::optional($resolver);

        return Inertia::render(
            'Inclusion/Students/Show',
            [
                'student' => fn (): array => $this->presenter->student(
                    $showStudent->execute($student),
                    $request,
                ),
                'profileNames' => fn (): array => $request->user()?->can('student-deficiency.view')
                    ? $showStudent->profileNames($student)
                    : [],
                'statusPanel' => function () use ($student, $showStudent, $currentSemesterQuery, $request): array {
                    $studentWithStatus = $showStudent->status($student);
                    $hasLaudo = $student->documents()
                        ->where('type', StudentDocumentType::TECHNICAL_REPORT->value)
                        ->exists();

                    return $this->presenter->statusPanel(
                        $studentWithStatus,
                        $hasLaudo,
                        $showStudent->currentCourseId($student),
                        $currentSemesterQuery->execute() !== null,
                        $request,
                    );
                },
                'studentCourses' => $tabProp(
                    'academic-data',
                    fn (): array => $this->presenter->studentCourses(
                        $showStudent->studentCourses($student),
                    ),
                ),
                'supportProfiles' => $tabProp(
                    'support-profiles',
                    fn (): array => $request->user()?->can('student-deficiency.view')
                        ? $this->presenter->deficiencies($showStudent->deficiencies($student))
                        : [],
                ),
                'guardians' => $tabProp(
                    'guardians',
                    fn (): array => $request->user()?->can('guardian.view')
                        ? $this->presenter->guardians($showStudent->guardians($student))
                        : [],
                ),
                'caseStudies' => $tabProp(
                    'case-studies',
                    fn (): array => $request->user()?->can('case-study.view')
                        ? $this->presenter->caseStudies($caseStudiesQuery->execute($student))
                        : [],
                ),
                'paees' => $tabProp(
                    'paees',
                    fn (): array => $request->user()?->can('paee.view')
                        ? $this->presenter->paees($paeesQuery->execute($student))
                        : [],
                ),
                'peis' => $tabProp(
                    'peis',
                    fn (): array => $request->user()?->can('pei.view')
                        ? $this->presenter->peis($showStudent->peis($student))
                        : [],
                ),
                'documents' => $tabProp(
                    'documents',
                    fn (): array => $request->user()?->can('student-document.view')
                        ? $this->presenter->documents($showStudent->documents($student))
                        : [],
                ),
                'aeeEvaluations' => $tabProp(
                    'aee-attendance',
                    function () use ($aeeEvaluationsQuery, $authenticatedUser, $student): array {
                        if (! $authenticatedUser?->canAny(['aee-record.view-all', 'aee-record.view-own'])) {
                            return [];
                        }

                        $evaluations = $aeeEvaluationsQuery->execute(
                            $student,
                            $authenticatedUser,
                            limit: null,
                        );
                        $this->presenter->markManageableAeeEvaluations(
                            $evaluations,
                            $authenticatedUser,
                        );

                        return $evaluations->values()->all();
                    },
                ),
                'pedagogicalRecords' => $tabProp(
                    'pedagogical-attendance',
                    function () use ($pedagogicalRecordsQuery, $authenticatedUser, $student): array {
                        if (! $authenticatedUser?->canAny(['pedagogical-record.view-all', 'pedagogical-record.view-own'])) {
                            return [];
                        }

                        $records = $pedagogicalRecordsQuery->execute(
                            $student,
                            $authenticatedUser,
                            limit: null,
                        );
                        $this->presenter->markManageablePedagogicalRecords(
                            $records,
                            $authenticatedUser,
                        );

                        return $records->values()->all();
                    },
                ),
                'loans' => $tabProp(
                    'loans',
                    fn (): array => $authenticatedUser?->can('loan.index')
                        ? $loansQuery->execute($student)
                            ->map(fn (Loan $loan): array => $loanPresenter->loan($loan))
                            ->values()
                            ->all()
                        : [],
                ),
                'activeTab' => $activeTab,
            ] + $this->presenter->shared($request, $student),
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
    ): Response {
        // Os atendimentos AEE e pedagógicos têm PDFs de histórico próprios e não entram na ficha.
        $student = $query->execute($student);

        $pdf = Pdf::loadView('pages.inclusion.students.pdf', compact('student'));

        PdfPageNumberer::apply($pdf);

        return $pdf->stream("ficha-aluno-{$student->registration}.pdf");
    }
}
