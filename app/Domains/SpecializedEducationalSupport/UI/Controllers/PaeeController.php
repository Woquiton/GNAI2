<?php

declare(strict_types=1);

namespace App\Domains\SpecializedEducationalSupport\UI\Controllers;

use App\Domains\Auth\Domain\Models\User;
use App\Domains\SpecializedEducationalSupport\Application\Actions\Paees\AddPaeeReviewAction;
use App\Domains\SpecializedEducationalSupport\Application\Actions\Paees\CreatePaeeAction;
use App\Domains\SpecializedEducationalSupport\Application\Actions\Paees\DeletePaeeAction;
use App\Domains\SpecializedEducationalSupport\Application\Actions\Paees\UpdatePaeeAction;
use App\Domains\SpecializedEducationalSupport\Application\Data\Paees\AddPaeeReviewData;
use App\Domains\SpecializedEducationalSupport\Application\Data\Paees\CreatePaeeData;
use App\Domains\SpecializedEducationalSupport\Application\Data\Paees\ListPaeesData;
use App\Domains\SpecializedEducationalSupport\Application\Data\Paees\UpdatePaeeData;
use App\Domains\SpecializedEducationalSupport\Application\Queries\Paees\ListPaeesQuery;
use App\Domains\SpecializedEducationalSupport\Application\Queries\Paees\PaeeFormQuery;
use App\Domains\SpecializedEducationalSupport\Application\Queries\Paees\ShowPaeeQuery;
use App\Domains\SpecializedEducationalSupport\Application\Queries\Students\StudentPaeesQuery;
use App\Domains\SpecializedEducationalSupport\Domain\Models\CaseStudy;
use App\Domains\SpecializedEducationalSupport\Domain\Models\Paee;
use App\Domains\SpecializedEducationalSupport\Domain\Models\Student;
use App\Shared\Application\Exceptions\AccessDeniedException;
use App\Shared\Infrastructure\Pdf\PdfPageNumberer;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\View\View;
use Throwable;

final class PaeeController
{
    public function all(ListPaeesData $filters, ListPaeesQuery $query, Request $request): View
    {
        $paees = $query->execute($filters);
        if ($request->ajax()) {
            return view('pages.specialized-educational-support.paees.partials.table', compact('paees'));
        }

        return view('pages.specialized-educational-support.paees.all', compact('paees'));
    }

    public function index(Student $student, ListPaeesData $filters, ListPaeesQuery $query, Request $request): View
    {
        $student->loadMissing('person');
        $paees = $query->execute($filters, $student);
        if ($request->ajax()) {
            return view('pages.specialized-educational-support.paees.partials.table', compact('paees', 'student'));
        }

        return view('pages.specialized-educational-support.paees.index', compact('student', 'paees'));
    }

    public function create(CaseStudy $caseStudy, PaeeFormQuery $form): View
    {
        return view('pages.specialized-educational-support.paees.create', $form->forCreation($caseStudy));
    }

    /** @throws Throwable */
    public function store(CreatePaeeData $data, CreatePaeeAction $action, Request $request): RedirectResponse
    {
        $paee = $action->execute($data, $this->user($request));

        return redirect()->route('specialized-educational-support.paee.show', $paee)->with('success', 'PAEE criado com sucesso.');
    }

    public function show(Paee $paee, ShowPaeeQuery $query): View
    {
        $paee = $query->execute($paee);

        \App\Shared\Domain\Support\AuditLogger::logView($paee);

        return view('pages.specialized-educational-support.paees.show', compact('paee'));
    }

    public function edit(Paee $paee, PaeeFormQuery $form): View
    {
        return view('pages.specialized-educational-support.paees.edit', $form->forUpdate($paee));
    }

    /** @throws Throwable */
    public function update(Paee $paee, UpdatePaeeData $data, UpdatePaeeAction $action, Request $request): RedirectResponse
    {
        $paee = $action->execute($paee, $data, $this->user($request));

        return redirect()->route('specialized-educational-support.paee.show', $paee)->with('success', 'PAEE atualizado com sucesso.');
    }

    /** @throws Throwable */
    public function destroy(Paee $paee, DeletePaeeAction $action): RedirectResponse
    {
        $studentId = $paee->student_id;
        $action->execute($paee);

        return redirect()->route('specialized-educational-support.students.paees.index', $studentId)->with('success', 'PAEE removido com sucesso.');
    }

    /** @throws Throwable */
    public function addReview(Paee $paee, AddPaeeReviewData $data, AddPaeeReviewAction $action, Request $request): RedirectResponse
    {
        $paee = $action->execute($paee, $data, $this->user($request));

        return redirect()->route('specialized-educational-support.paee.show', $paee)->with('success', 'Revisão registrada com sucesso.');
    }

    public function pdf(Paee $paee, ShowPaeeQuery $query): Response
    {
        $paee = $query->execute($paee);
        $pdf = Pdf::loadView('pages.specialized-educational-support.paees.pdf', compact('paee'))->setPaper('a4', 'portrait');
        PdfPageNumberer::apply($pdf);

        return $pdf->stream("paee-{$paee->getKey()}.pdf");
    }

    public function studentHistory(Student $student, StudentPaeesQuery $query): View
    {
        $student->loadMissing('person');
        $paees = $query->execute($student);

        return view('pages.specialized-educational-support.students.paees.index', compact('student', 'paees'));
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
