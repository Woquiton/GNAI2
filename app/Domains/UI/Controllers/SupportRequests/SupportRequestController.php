<?php

declare(strict_types=1);

namespace App\Domains\UI\Controllers\SupportRequests;

use App\Domains\Application\Actions\SupportRequests\CreateSupportRequestAction;
use App\Domains\Application\Actions\SupportRequests\DeleteSupportRequestAction;
use App\Domains\Application\Actions\SupportRequests\UpdateSupportRequestAction;
use App\Domains\Application\Data\SupportRequests\CreateSupportRequestData;
use App\Domains\Application\Data\SupportRequests\ListSupportRequestsData;
use App\Domains\Application\Data\SupportRequests\SupportRequestContextData;
use App\Domains\Application\Data\SupportRequests\UpdateSupportRequestData;
use App\Domains\Application\Queries\SupportRequests\ListSupportRequestsQuery;
use App\Domains\Application\Queries\SupportRequests\ShowSupportRequestQuery;
use App\Domains\Application\Queries\SupportRequests\SupportRequestFormQuery;
use App\Domains\Domain\Models\SupportRequests\SupportRequest;
use App\Domains\Domain\Models\SupportRequests\SupportRequestAttachment;
use App\Domains\Infrastructure\Storage\SupportRequests\SupportRequestAttachmentStorage;
use App\Domains\UI\Presenters\SupportRequests\SupportRequestPresenter;
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
        return Inertia::render('SupportRequests/Index', [
            'requests' => $query->execute($filters)->through(fn ($record) => $this->presenter->summary($record)),
            'filters' => [
                'created_from' => $filters->createdFrom ?? '',
                'created_to' => $filters->createdTo ?? '',
                'search' => $filters->search ?? '',
                'status' => $filters->status ?? '',
                'student_id' => $filters->studentId === null ? '' : (string) $filters->studentId,
            ],
            'statuses' => $form->choices()['statuses'],
            'students' => $form->students(),
            'can' => $this->presenter->permissions($request),
        ]);
    }

    public function create(SupportRequestContextData $context, SupportRequestFormQuery $form): InertiaResponse
    {
        return Inertia::render('SupportRequests/Create', $form->forCreation($context->studentId) + ['fromStudent' => $context->fromStudent]);
    }

    /** @throws Throwable */
    public function store(CreateSupportRequestData $data, CreateSupportRequestAction $action, SupportRequestContextData $context, Request $request): RedirectResponse
    {
        $record = $action->execute($data, (int) $request->user()->getAuthIdentifier());

        return redirect()->route('specialized-educational-support.support-requests.show', ['supportRequest' => $record, ...($context->fromStudent ? ['from_student' => 1] : [])])
            ->with('success', 'Solicitação de atendimento registrada com sucesso.');
    }

    public function show(SupportRequest $supportRequest, ShowSupportRequestQuery $query, SupportRequestContextData $context, Request $request): InertiaResponse
    {
        return Inertia::render('SupportRequests/Show', [
            'supportRequest' => $this->presenter->details($query->execute($supportRequest)),
            'can' => $this->presenter->permissions($request),
            'fromStudent' => $context->fromStudent,
        ]);
    }

    public function edit(SupportRequest $supportRequest, ShowSupportRequestQuery $query, SupportRequestFormQuery $form, SupportRequestContextData $context): InertiaResponse
    {
        return Inertia::render('SupportRequests/Edit', [
            'supportRequest' => $this->presenter->details($query->execute($supportRequest)),
            'fromStudent' => $context->fromStudent,
        ] + $form->forUpdate($supportRequest));
    }

    /** @throws Throwable */
    public function update(SupportRequest $supportRequest, UpdateSupportRequestData $data, UpdateSupportRequestAction $action, SupportRequestContextData $context): RedirectResponse
    {
        $record = $action->execute($supportRequest, $data);

        return redirect()->route('specialized-educational-support.support-requests.show', ['supportRequest' => $record, ...($context->fromStudent ? ['from_student' => 1] : [])])
            ->with('success', 'Solicitação de atendimento atualizada com sucesso.');
    }

    /** @throws Throwable */
    public function destroy(SupportRequest $supportRequest, DeleteSupportRequestAction $action, SupportRequestContextData $context): RedirectResponse
    {
        $action->execute($supportRequest);

        $redirect = $context->fromStudent
            ? redirect()->route('specialized-educational-support.students.show', ['student' => $supportRequest->student_id, 'tab' => 'support-requests'])
            : redirect()->route('specialized-educational-support.support-requests.index');

        return $redirect->with('success', 'Solicitação de atendimento excluída com sucesso.');
    }

    public function attachment(SupportRequest $supportRequest, SupportRequestAttachment $attachment, SupportRequestAttachmentStorage $storage): StreamedResponse
    {
        abort_unless((int) $attachment->support_request_id === (int) $supportRequest->id, 404);

        return $storage->download($attachment);
    }

    public function pdf(SupportRequest $supportRequest, ShowSupportRequestQuery $query): Response
    {
        $record = $this->presenter->details($query->execute($supportRequest));
        $pdf = Pdf::loadView('pages.support-requests.pdf', compact('record'))->setPaper('a4', 'portrait');
        PdfPageNumberer::apply($pdf);

        return $pdf->stream('solicitacao-atendimento-'.$supportRequest->id.'.pdf');
    }
}
