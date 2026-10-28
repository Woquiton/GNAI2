<?php

declare(strict_types=1);

namespace App\Domains\SpecializedEducationalSupport\UI\Controllers;

use App\Domains\Auth\Domain\Models\User;
use App\Domains\SpecializedEducationalSupport\Application\Actions\CaseStudies\AddCaseStudyContributionAction;
use App\Domains\SpecializedEducationalSupport\Application\Actions\CaseStudies\CompleteCaseStudyAction;
use App\Domains\SpecializedEducationalSupport\Application\Actions\CaseStudies\CreateCaseStudyAction;
use App\Domains\SpecializedEducationalSupport\Application\Actions\CaseStudies\DeleteCaseStudyAction;
use App\Domains\SpecializedEducationalSupport\Application\Actions\CaseStudies\UpdateCaseStudyAction;
use App\Domains\SpecializedEducationalSupport\Application\Data\CaseStudies\CreateCaseStudyData;
use App\Domains\SpecializedEducationalSupport\Application\Data\CaseStudies\ListCaseStudiesData;
use App\Domains\SpecializedEducationalSupport\Application\Data\CaseStudies\UpdateCaseStudyData;
use App\Domains\SpecializedEducationalSupport\Application\Queries\CaseStudies\CaseStudyFormQuery;
use App\Domains\SpecializedEducationalSupport\Application\Queries\CaseStudies\ListCaseStudiesQuery;
use App\Domains\SpecializedEducationalSupport\Application\Queries\CaseStudies\ShowCaseStudyQuery;
use App\Domains\SpecializedEducationalSupport\Application\Queries\Students\StudentCaseStudiesQuery;
use App\Domains\SpecializedEducationalSupport\Domain\Models\CaseStudy;
use App\Domains\SpecializedEducationalSupport\Domain\Models\Student;
use App\Shared\Application\Exceptions\AccessDeniedException;
use App\Shared\Infrastructure\Pdf\PdfPageNumberer;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\View\View;
use Throwable;

final class CaseStudyController
{
    public function all(ListCaseStudiesData $filters, ListCaseStudiesQuery $query, Request $request): View
    {
        $caseStudies = $query->execute($filters);
        if ($request->ajax()) {
            return view('pages.specialized-educational-support.case-studies.partials.table', compact('caseStudies'));
        }

        return view('pages.specialized-educational-support.case-studies.all', compact('caseStudies'));
    }

    public function index(Student $student, ListCaseStudiesData $filters, ListCaseStudiesQuery $query, Request $request): View
    {
        $student->loadMissing('person');
        $caseStudies = $query->execute($filters, $student);
        if ($request->ajax()) {
            return view('pages.specialized-educational-support.case-studies.partials.table', compact('caseStudies', 'student'));
        }

        return view('pages.specialized-educational-support.case-studies.index', compact('student', 'caseStudies'));
    }

    public function create(Student $student, CaseStudyFormQuery $form): View
    {
        return view('pages.specialized-educational-support.case-studies.create', $form->forCreation($student));
    }

    /** @throws Throwable */
    public function store(Student $student, CreateCaseStudyData $data, CreateCaseStudyAction $action, Request $request): RedirectResponse
    {
        $caseStudy = $action->execute($student, $data, $this->user($request));

        return redirect()->route('specialized-educational-support.case-study.show', $caseStudy)->with('success', 'Estudo de Caso criado com sucesso.');
    }

    public function show(CaseStudy $caseStudy, ShowCaseStudyQuery $query): View
    {
        $caseStudy = $query->execute($caseStudy);

        \App\Shared\Domain\Support\AuditLogger::logView($caseStudy);

        return view('pages.specialized-educational-support.case-studies.show', compact('caseStudy'));
    }

    public function edit(CaseStudy $caseStudy, CaseStudyFormQuery $form): View
    {
        return view('pages.specialized-educational-support.case-studies.edit', $form->forUpdate($caseStudy));
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
        $pdf = Pdf::loadView('pages.specialized-educational-support.case-studies.pdf', compact('caseStudy'))->setPaper('a4', 'portrait');
        PdfPageNumberer::apply($pdf);

        return $pdf->stream("estudo-de-caso-{$caseStudy->getKey()}.pdf");
    }

    public function studentHistory(Student $student, StudentCaseStudiesQuery $query): View
    {
        $student->loadMissing('person');
        $caseStudies = $query->history($student);

        return view('pages.specialized-educational-support.students.case-studies.index', compact('student', 'caseStudies'));
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
