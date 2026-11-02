<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\UI\Controllers;

use App\Domains\Auth\Domain\Models\User;
use App\Domains\Inclusion\Application\Actions\CaseStudies\AddCaseStudyContributionAction;
use App\Domains\Inclusion\Application\Actions\CaseStudies\CompleteCaseStudyAction;
use App\Domains\Inclusion\Application\Actions\CaseStudies\CreateCaseStudyAction;
use App\Domains\Inclusion\Application\Actions\CaseStudies\DeleteCaseStudyAction;
use App\Domains\Inclusion\Application\Actions\CaseStudies\UpdateCaseStudyAction;
use App\Domains\Inclusion\Application\Data\CaseStudies\CreateCaseStudyData;
use App\Domains\Inclusion\Application\Data\CaseStudies\ListCaseStudiesData;
use App\Domains\Inclusion\Application\Data\CaseStudies\UpdateCaseStudyData;
use App\Domains\Inclusion\Application\Queries\CaseStudies\CaseStudyFormQuery;
use App\Domains\Inclusion\Application\Queries\CaseStudies\ListCaseStudiesQuery;
use App\Domains\Inclusion\Application\Queries\CaseStudies\ShowCaseStudyQuery;
use App\Domains\Inclusion\Application\Queries\Peis\PeiFilterOptionsQuery;
use App\Domains\Inclusion\Application\Queries\Students\StudentCaseStudiesQuery;
use App\Domains\Inclusion\Domain\Models\CaseStudy;
use App\Domains\Inclusion\Domain\Models\Student;
use App\Domains\Inclusion\UI\Presenters\CaseStudyPagePresenter;
use App\Shared\Application\Exceptions\AccessDeniedException;
use App\Shared\Infrastructure\Pdf\PdfPageNumberer;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Throwable;

final class CaseStudyController
{
    public function __construct(private readonly CaseStudyPagePresenter $presenter) {}

    public function all(
        ListCaseStudiesData $filters,
        ListCaseStudiesQuery $query,
        PeiFilterOptionsQuery $filterOptions,
        Request $request,
    ): InertiaResponse {
        return Inertia::render(
            'Inclusion/CaseStudies/All',
            $this->presenter->list($query->execute($filters), $filterOptions->semesters(), $filters, $request),
        );
    }

    public function index(
        Student $student,
        ListCaseStudiesData $filters,
        ListCaseStudiesQuery $query,
        PeiFilterOptionsQuery $filterOptions,
        Request $request,
    ): InertiaResponse {
        return Inertia::render(
            'Inclusion/CaseStudies/Index',
            $this->presenter->list($query->execute($filters, $student), $filterOptions->semesters(), $filters, $request, $student),
        );
    }

    public function create(Student $student, CaseStudyFormQuery $form): InertiaResponse
    {
        ['student' => $student] = $form->forCreation($student);

        return Inertia::render('Inclusion/CaseStudies/Create', $this->presenter->form($student));
    }

    /** @throws Throwable */
    public function store(Student $student, CreateCaseStudyData $data, CreateCaseStudyAction $action, Request $request): RedirectResponse
    {
        $caseStudy = $action->execute($student, $data, $this->user($request));

        return redirect()->route('specialized-educational-support.case-study.show', $caseStudy)->with('success', 'Estudo de Caso criado com sucesso.');
    }

    public function show(CaseStudy $caseStudy, ShowCaseStudyQuery $query, Request $request): InertiaResponse
    {
        $caseStudy = $query->execute($caseStudy);

        return Inertia::render('Inclusion/CaseStudies/Show', $this->presenter->show($caseStudy, $request));
    }

    public function edit(CaseStudy $caseStudy, CaseStudyFormQuery $form): InertiaResponse
    {
        ['caseStudy' => $caseStudy] = $form->forUpdate($caseStudy);

        return Inertia::render('Inclusion/CaseStudies/Edit', $this->presenter->form($caseStudy->student, $caseStudy));
    }

    /** @throws Throwable */
    public function update(CaseStudy $caseStudy, UpdateCaseStudyData $data, UpdateCaseStudyAction $action): RedirectResponse
    {
        $caseStudy = $action->execute($caseStudy, $data);

        return redirect()->route('specialized-educational-support.case-study.show', $caseStudy)->with('success', 'Estudo de Caso atualizado com sucesso.');
    }

    /** @throws Throwable */
    public function destroy(CaseStudy $caseStudy, DeleteCaseStudyAction $action): RedirectResponse
    {
        $studentId = $caseStudy->student_id;
        $action->execute($caseStudy);

        return redirect()->route('specialized-educational-support.students.case-studies.index', $studentId)->with('success', 'Estudo de Caso removido com sucesso.');
    }

    /** @throws Throwable */
    public function complete(CaseStudy $caseStudy, CompleteCaseStudyAction $action): RedirectResponse
    {
        $caseStudy = $action->execute($caseStudy);

        return redirect()->route('specialized-educational-support.case-study.show', $caseStudy)->with('success', 'Estudo de Caso concluído com sucesso.');
    }

    public function addContribution(CaseStudy $caseStudy, Request $request, AddCaseStudyContributionAction $action): RedirectResponse
    {
        $validated = $request->validate([
            'role' => ['required', 'string', 'max:100'],
            'content' => ['required', 'string', 'max:100000'],
        ]);

        $action->execute($caseStudy, $this->user($request), $validated['role'], $validated['content']);

        return redirect()->route('specialized-educational-support.case-study.show', $caseStudy)->with('success', 'Contribuição registrada com sucesso.');
    }

    public function pdf(CaseStudy $caseStudy, ShowCaseStudyQuery $query): Response
    {
        $caseStudy = $query->execute($caseStudy);
        $pdf = Pdf::loadView('pages.inclusion.case-studies.pdf', compact('caseStudy'))->setPaper('a4', 'portrait');
        PdfPageNumberer::apply($pdf);

        return $pdf->stream("estudo-de-caso-{$caseStudy->getKey()}.pdf");
    }

    public function studentHistory(Student $student, StudentCaseStudiesQuery $query, Request $request): InertiaResponse
    {
        return Inertia::render(
            'Inclusion/CaseStudies/History',
            $this->presenter->history($student, $query->history($student), $request),
        );
    }

    private function user(Request $request): User
    {
        $user = $request->user();
        if (! $user instanceof User) {
            throw new AccessDeniedException('Usuário autenticado inválido.');
        }

        return $user;
    }
}
