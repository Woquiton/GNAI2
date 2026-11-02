<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\UI\Controllers;

use App\Domains\Auth\Domain\Models\User;
use App\Domains\Inclusion\Application\Actions\Paees\AddPaeeReviewAction;
use App\Domains\Inclusion\Application\Actions\Paees\CreatePaeeAction;
use App\Domains\Inclusion\Application\Actions\Paees\DeletePaeeAction;
use App\Domains\Inclusion\Application\Actions\Paees\UpdatePaeeAction;
use App\Domains\Inclusion\Application\Data\Paees\AddPaeeReviewData;
use App\Domains\Inclusion\Application\Data\Paees\CreatePaeeData;
use App\Domains\Inclusion\Application\Data\Paees\ListPaeesData;
use App\Domains\Inclusion\Application\Data\Paees\UpdatePaeeData;
use App\Domains\Inclusion\Application\Queries\Paees\ListPaeesQuery;
use App\Domains\Inclusion\Application\Queries\Paees\PaeeFormQuery;
use App\Domains\Inclusion\Application\Queries\Paees\ShowPaeeQuery;
use App\Domains\Inclusion\Application\Queries\Peis\PeiFilterOptionsQuery;
use App\Domains\Inclusion\Domain\Models\CaseStudy;
use App\Domains\Inclusion\Domain\Models\Paee;
use App\Domains\Inclusion\UI\Presenters\PaeePagePresenter;
use App\Shared\Application\Exceptions\AccessDeniedException;
use App\Shared\Infrastructure\Pdf\PdfPageNumberer;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Throwable;

final class PaeeController
{
    public function __construct(private readonly PaeePagePresenter $presenter) {}

    public function all(ListPaeesData $filters, ListPaeesQuery $query, PeiFilterOptionsQuery $options, Request $request): InertiaResponse
    {
        return Inertia::render(
            'Inclusion/Paees/All',
            $this->presenter->list($query->execute($filters), $options->semesters(), $filters, $request),
        );
    }

    public function create(CaseStudy $caseStudy, PaeeFormQuery $form): InertiaResponse
    {
        ['caseStudy' => $caseStudy, 'assistiveTechnologies' => $assistiveTechnologies] = $form->forCreation($caseStudy);

        return Inertia::render('Inclusion/Paees/Create', $this->presenter->create($caseStudy, $assistiveTechnologies));
    }

    /** @throws Throwable */
    public function store(CreatePaeeData $data, CreatePaeeAction $action, Request $request): RedirectResponse
    {
        $paee = $action->execute($data, $this->user($request));

        return redirect()->route('specialized-educational-support.paee.show', $paee)->with('success', 'PAEE criado com sucesso.');
    }

    public function show(Paee $paee, ShowPaeeQuery $query, Request $request): InertiaResponse
    {
        $paee = $query->execute($paee);

        return Inertia::render('Inclusion/Paees/Show', $this->presenter->show($paee, $request));
    }

    public function edit(Paee $paee, PaeeFormQuery $form): InertiaResponse
    {
        ['paee' => $paee, 'assistiveTechnologies' => $assistiveTechnologies] = $form->forUpdate($paee);

        return Inertia::render('Inclusion/Paees/Edit', $this->presenter->edit($paee, $assistiveTechnologies));
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

        return redirect()->route('specialized-educational-support.students.show', [
            'student' => $studentId,
            'tab' => 'paees',
        ])->with('success', 'PAEE removido com sucesso.');
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
        $pdf = Pdf::loadView('pages.inclusion.paees.pdf', compact('paee'))->setPaper('a4', 'portrait');
        PdfPageNumberer::apply($pdf);

        return $pdf->stream("paee-{$paee->getKey()}.pdf");
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
