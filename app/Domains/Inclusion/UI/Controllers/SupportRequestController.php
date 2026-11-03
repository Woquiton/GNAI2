<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\UI\Controllers;

use App\Domains\Inclusion\Application\Actions\SupportRequests\CreateSupportRequestAction;
use App\Domains\Inclusion\Application\Actions\SupportRequests\DeleteSupportRequestAction;
use App\Domains\Inclusion\Application\Actions\SupportRequests\UpdateSupportRequestAction;
use App\Domains\Inclusion\Application\Data\SupportRequests\CreateSupportRequestData;
use App\Domains\Inclusion\Application\Data\SupportRequests\ListSupportRequestsData;
use App\Domains\Inclusion\Application\Data\SupportRequests\SupportRequestContextData;
use App\Domains\Inclusion\Application\Data\SupportRequests\UpdateSupportRequestData;
use App\Domains\Inclusion\Application\Queries\SupportRequests\ListSupportRequestsQuery;
use App\Domains\Inclusion\Application\Queries\SupportRequests\ShowSupportRequestQuery;
use App\Domains\Inclusion\Application\Queries\SupportRequests\SupportRequestFormQuery;
use App\Domains\Inclusion\Domain\Models\SupportRequest;
use App\Domains\Inclusion\Domain\Models\SupportRequestAttachment;
use App\Domains\Inclusion\Infrastructure\Storage\SupportRequestAttachmentStorage;
use App\Domains\Inclusion\UI\Presenters\SupportRequestPresenter;
use App\Shared\Infrastructure\Pdf\PdfPageNumberer;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Throwable;

final readonly class SupportRequestController
{
    public function __construct(private SupportRequestPresenter $presenter) {}

    public function index(ListSupportRequestsData $filters, ListSupportRequestsQuery $query, SupportRequestFormQuery $form, Request $request): InertiaResponse
    {
        return Inertia::render('Inclusion/SupportRequests/Index', [
            'requests' => $query->execute($filters)->through(fn ($record) => $this->presenter->summary($record)),
            'filters' => ['search' => $filters->search ?? '', 'status' => $filters->status ?? '', 'student_id' => $filters->studentId === null ? '' : (string) $filters->studentId],
            'statuses' => $form->choices()['statuses'],
            'students' => $form->students(),
            'can' => $this->presenter->permissions($request),
        ]);
    }

    public function create(SupportRequestContextData $context, SupportRequestFormQuery $form): InertiaResponse
    {
        return Inertia::render('Inclusion/SupportRequests/Create', $form->forCreation($context->studentId));
    }

    /** @throws Throwable */
    public function store(CreateSupportRequestData $data, CreateSupportRequestAction $action, Request $request): RedirectResponse
    {
        $record = $action->execute($data, (int) $request->user()->getAuthIdentifier());

        return redirect()->route('specialized-educational-support.support-requests.show', $record)
            ->with('success', 'Solicitação de atendimento registrada com sucesso.');
    }

    public function show(SupportRequest $supportRequest, ShowSupportRequestQuery $query, Request $request): InertiaResponse
    {
        return Inertia::render('Inclusion/SupportRequests/Show', [
            'supportRequest' => $this->presenter->details($query->execute($supportRequest)),
            'can' => $this->presenter->permissions($request),
        ]);
    }

    public function edit(SupportRequest $supportRequest, ShowSupportRequestQuery $query, SupportRequestFormQuery $form): InertiaResponse
    {
        return Inertia::render('Inclusion/SupportRequests/Edit', [
            'supportRequest' => $this->presenter->details($query->execute($supportRequest)),
        ] + $form->forUpdate($supportRequest));
    }

    /** @throws Throwable */
    public function update(SupportRequest $supportRequest, UpdateSupportRequestData $data, UpdateSupportRequestAction $action): RedirectResponse
    {
        $record = $action->execute($supportRequest, $data);

        return redirect()->route('specialized-educational-support.support-requests.show', $record)
            ->with('success', 'Solicitação de atendimento atualizada com sucesso.');
    }

    /** @throws Throwable */
    public function destroy(SupportRequest $supportRequest, DeleteSupportRequestAction $action): RedirectResponse
    {
        $action->execute($supportRequest);

        return redirect()->route('specialized-educational-support.support-requests.index')
            ->with('success', 'Solicitação de atendimento excluída com sucesso.');
    }

    public function attachment(SupportRequest $supportRequest, SupportRequestAttachment $attachment, SupportRequestAttachmentStorage $storage): StreamedResponse
    {
        abort_unless((int) $attachment->support_request_id === (int) $supportRequest->id, 404);

        return $storage->download($attachment);
    }

    public function pdf(SupportRequest $supportRequest, ShowSupportRequestQuery $query): Response
    {
        $record = $this->presenter->details($query->execute($supportRequest));
        $pdf = Pdf::loadView('pages.inclusion.support-requests.pdf', compact('record'))->setPaper('a4', 'portrait');
        PdfPageNumberer::apply($pdf);

        return $pdf->stream('solicitacao-atendimento-'.$supportRequest->id.'.pdf');
    }
}
