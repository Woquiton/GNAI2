<?php

declare(strict_types=1);

namespace App\Domains\UI\Controllers\Publications;

use App\Domains\Application\Actions\Publications\CreatePublicationAction;
use App\Domains\Application\Actions\Publications\DeletePublicationAction;
use App\Domains\Application\Actions\Publications\UpdatePublicationAction;
use App\Domains\Application\Data\Publications\CreatePublicationData;
use App\Domains\Application\Data\Publications\ListPublicationsData;
use App\Domains\Application\Data\Publications\UpdatePublicationData;
use App\Domains\Application\Queries\Publications\ListPublicationsQuery;
use App\Domains\Application\Queries\Publications\PublicationFormQuery;
use App\Domains\Application\Queries\Publications\PublicationPdfQuery;
use App\Domains\Application\Queries\Publications\ShowPublicationQuery;
use App\Domains\Domain\Enums\Publications\PublicationType;
use App\Domains\Domain\Exceptions\Publications\InvalidPublication;
use App\Domains\Domain\Models\Publications\Publication;
use App\Domains\UI\Presenters\Publications\PublicationPresenter;
use App\Shared\Infrastructure\Pdf\PdfPageNumberer;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Throwable;

/**
 * Publicações do site (antiga agenda institucional): notícias, eventos,
 * comunicados, artigos e registros. Eventos guardam o período apenas como
 * registro exibido no site, sem lembretes automáticos.
 */
final class PublicationController
{
    public function __construct(private readonly PublicationPresenter $presenter) {}

    public function index(ListPublicationsData $filters, ListPublicationsQuery $query, Request $request): InertiaResponse
    {
        $publications = $query->execute($filters)->through(
            fn (Publication $publication): array => $this->presenter->publication($publication),
        );

        return Inertia::render(
            'Publications/Index',
            [
                'publications' => $publications,
                'filters' => $request->only(['title', 'is_active', 'type', 'per_page']),
                'types' => PublicationType::options(),
                'can' => [
                    'create' => $request->user()?->can('publication.create') ?? false,
                    'show' => $request->user()?->can('publication.show') ?? false,
                    'destroy' => $request->user()?->can('publication.destroy') ?? false,
                ],
            ],
        );
    }

    public function create(Request $request, PublicationFormQuery $formQuery): InertiaResponse
    {
        $backRoute = $request->query('back')
            ?? route('inclusive-radar.publications.index');

        return Inertia::render('Publications/Create', [
            'backRoute' => $backRoute,
            'options' => $formQuery->execute($request->user()),
            'can' => ['submit' => $request->user()?->can('publication.store') ?? false],
        ]);
    }

    /**
     * @throws InvalidPublication
     * @throws Throwable
     */
    public function store(CreatePublicationData $data, CreatePublicationAction $action): RedirectResponse
    {
        $action->execute($data);

        return redirect()
            ->route('inclusive-radar.publications.index')
            ->with('success', 'Publicação criada com sucesso!');
    }

    public function show(Request $request, Publication $publication, ShowPublicationQuery $query): InertiaResponse
    {
        $publication = $this->presenter->publication($query->execute($publication), detailed: true);
        $backRoute = $request->query('back')
            ?? route('inclusive-radar.publications.index');

        return Inertia::render('Publications/Show', [
            'publication' => $publication,
            'backRoute' => $backRoute,
            'can' => [
                'edit' => $request->user()?->can('publication.edit') ?? false,
                'destroy' => $request->user()?->can('publication.destroy') ?? false,
                'pdf' => $request->user()?->can('publication.pdf') ?? false,
            ],
        ]);
    }

    public function edit(
        Publication $publication,
        Request $request,
        ShowPublicationQuery $query,
        PublicationFormQuery $formQuery,
    ): InertiaResponse {
        $publication = $query->execute($publication);

        return Inertia::render('Publications/Edit', [
            'publication' => $this->presenter->publication($publication, detailed: true),
            'options' => $formQuery->execute(
                $request->user(),
                $publication->speakers->pluck('professional_id')->filter()->map(fn ($id): int => (int) $id)->values()->all(),
                $publication->tags->modelKeys(),
            ),
            'can' => ['submit' => $request->user()?->can('publication.update') ?? false],
        ]);
    }

    /**
     * @throws InvalidPublication
     * @throws Throwable
     */
    public function update(UpdatePublicationData $data, Publication $publication, UpdatePublicationAction $action): RedirectResponse
    {
        $action->execute($publication, $data);

        return redirect()
            ->route('inclusive-radar.publications.index')
            ->with('success', 'Publicação atualizada com sucesso!');
    }

    /**
     * @throws Throwable
     */
    public function destroy(Publication $publication, DeletePublicationAction $action): RedirectResponse
    {
        $action->execute($publication);

        return redirect()
            ->route('inclusive-radar.publications.index')
            ->with('success', 'Publicação removida com sucesso!');
    }

    public function generatePdf(Publication $publication, PublicationPdfQuery $query): Response
    {
        $publication = $query->execute($publication);

        $pdf = Pdf::loadView(
            'pages.publications.pdf',
            compact('publication'),
        )
            ->setPaper('a4', 'portrait');

        PdfPageNumberer::apply($pdf);

        return $pdf->stream("Publicacao_{$publication->id}.pdf");
    }
}
