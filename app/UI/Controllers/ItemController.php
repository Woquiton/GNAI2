<?php

declare(strict_types=1);

namespace App\UI\Controllers;

use App\Application\Actions\Items\CreateItemAction;
use App\Application\Actions\Items\DeleteItemAction;
use App\Application\Actions\Items\SetItemCoverAction;
use App\Application\Actions\Items\UpdateItemAction;
use App\Application\Data\Items\CreateItemData;
use App\Application\Data\Items\ListItemsData;
use App\Application\Data\Items\SetItemCoverData;
use App\Application\Data\Items\UpdateItemData;
use App\Application\Queries\Items\ItemFilterOptionsQuery;
use App\Application\Queries\Items\ItemFormQuery;
use App\Application\Queries\Items\ItemPdfQuery;
use App\Application\Queries\Items\ListItemsQuery;
use App\Application\Queries\Items\ShowItemInspectionQuery;
use App\Application\Queries\Items\ShowItemQuery;
use App\Domain\Enums\ItemType;
use App\Domain\Exceptions\AssetCodeAlreadyInUse;
use App\Domain\Models\Inspection;
use App\Domain\Models\InspectionEvidence;
use App\Domain\Models\Item;
use App\Domain\Models\Loan;
use App\UI\Presenters\ItemPresenter;
use App\UI\Presenters\LoanPresenter;
use App\Shared\Infrastructure\Pdf\PdfPageNumberer;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Throwable;

final class ItemController
{
    public function index(
        ListItemsData $filters,
        ListItemsQuery $query,
        ItemFilterOptionsQuery $filterOptions,
        ItemPresenter $presenter,
        Request $request,
    ): InertiaResponse {
        return Inertia::render(
            'Items/Index',
            [
                'items' => $presenter->items($query->execute($filters)),
                'accessibilityFeatureOptions' => ['' => 'Recurso de acessibilidade (Todos)'] + $filterOptions->execute(),
                'itemTypeOptions' => ['' => 'Tipo do item (Todos)'] + ItemType::options(),
                'filters' => $request->only([
                    'name',
                    'item_type',
                    'is_digital',
                    'accessibility_feature_id',
                    'is_active',
                    'available',
                    'per_page',
                ]),
                'can' => [
                    'create' => $request->user()?->can('item.create') ?? false,
                    'show' => $request->user()?->can('item.show') ?? false,
                    'destroy' => $request->user()?->can('item.destroy') ?? false,
                ],
            ],
        );
    }

    public function create(ItemFormQuery $form, Request $request): InertiaResponse
    {
        return Inertia::render(
            'Items/Create',
            $form->forCreation() + [
                'can' => ['submit' => $request->user()?->can('item.store') ?? false],
            ],
        );
    }

    public function clone(Item $item, ItemFormQuery $form, Request $request): InertiaResponse
    {
        return Inertia::render(
            'Items/Create',
            $form->forCloning($item) + [
                'can' => ['submit' => $request->user()?->can('item.store') ?? false],
            ],
        );
    }

    public function store(CreateItemData $data, CreateItemAction $action, Request $request): RedirectResponse
    {
        try {
            $action->execute(
                data: $data,
                registeredBy: (int) $request->user()?->getAuthIdentifier(),
            );
        } catch (AssetCodeAlreadyInUse $exception) {
            return back()
                ->withInput()
                ->withErrors(['asset_code' => $exception->getMessage()]);
        }

        return redirect()
            ->route('inclusive-radar.items.index')
            ->with('success', 'Item criado com sucesso!');
    }

    public function show(
        Item $item,
        ShowItemQuery $query,
        ItemPresenter $presenter,
        LoanPresenter $loanPresenter,
        Request $request,
    ): InertiaResponse {
        $item = $query->execute($item);
        $loans = $item->loans;
        // O histórico segue apresentado pelo LoanPresenter, sem duplicar os registros crus no item.
        $item->unsetRelation('loans');
        $canListLoans = $request->user()?->can('loan.index') ?? false;

        return Inertia::render('Items/Show', [
            'item' => $item,
            'loans' => $canListLoans
                ? $loans->map(fn (Loan $loan): array => $loanPresenter->loan($loan->setRelation('loanable', $item)))->values()->all()
                : [],
            'deficiencies' => $item->deficiencies,
            'features' => $item->accessibilityFeatures,
            'display' => $presenter->display($item),
            'can' => [
                'clone' => $request->user()?->can('item.create') ?? false,
                'edit' => $request->user()?->can('item.edit') ?? false,
                'inspection' => $request->user()?->can('item.inspection.show') ?? false,
                'pdf' => $request->user()?->can('item.pdf') ?? false,
                'destroy' => $request->user()?->can('item.destroy') ?? false,
                'loans' => $canListLoans,
                'viewLoan' => $request->user()?->can('loan.show') ?? false,
                'viewStudent' => $request->user()?->can('student.view') ?? false,
            ],
        ]);
    }

    public function edit(Item $item, ItemFormQuery $form, Request $request): InertiaResponse
    {
        return Inertia::render(
            'Items/Edit',
            $form->forUpdate($item) + [
                'can' => ['submit' => $request->user()?->can('item.update') ?? false],
            ],
        );
    }

    public function update(UpdateItemData $data, Item $item, UpdateItemAction $action, Request $request): RedirectResponse
    {
        try {
            $action->execute(
                item: $item,
                data: $data,
                registeredBy: (int) $request->user()?->getAuthIdentifier(),
            );
        } catch (AssetCodeAlreadyInUse $exception) {
            return back()
                ->withInput()
                ->withErrors(['asset_code' => $exception->getMessage()]);
        }

        return redirect()
            ->route('inclusive-radar.items.index')
            ->with('success', 'Item atualizado com sucesso!');
    }

    /**
     * @throws Throwable
     */
    public function destroy(Item $item, DeleteItemAction $action): RedirectResponse
    {
        $action->execute($item);

        return redirect()
            ->route('inclusive-radar.items.index')
            ->with('success', 'Item removido com sucesso!');
    }

    public function generatePdf(Item $item, ItemPdfQuery $query): Response
    {
        $item = $query->execute($item);

        $pdf = Pdf::loadView(
            'pages.items.pdf',
            compact('item'),
        )
            ->setPaper('a4', 'portrait');

        PdfPageNumberer::apply($pdf);

        $prefix = $item->item_type === ItemType::AssistiveTechnology ? 'TA' : 'MPA';

        return $pdf->stream("{$prefix}_{$item->name}.pdf");
    }

    public function showInspection(
        Item $item,
        Inspection $inspection,
        ShowItemInspectionQuery $query,
        ItemPresenter $presenter,
        Request $request,
    ): InertiaResponse {
        $scopedInspection = $query->execute(
            item: $item,
            inspection: $inspection,
        );

        return Inertia::render('Items/Inspections/Show', [
            'item' => $item->only(['id', 'name']),
            'inspection' => $presenter->inspection($scopedInspection),
            'cover' => $presenter->cover($item),
            'canSetCover' => $request->user()?->can('item.update') ?? false,
        ]);
    }

    public function setCover(
        Item $item,
        InspectionEvidence $evidence,
        SetItemCoverData $data,
        SetItemCoverAction $action,
    ): RedirectResponse {
        $action->execute($item, $evidence, $data);

        return redirect()->back()->with('success', 'Imagem favoritada e definida como capa do item.');
    }
}
