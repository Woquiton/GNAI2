<?php

declare(strict_types=1);

namespace App\UI\Controllers;

use App\Application\Actions\Deficiencies\CreateDeficiencyAction;
use App\Application\Actions\Deficiencies\DeleteDeficiencyAction;
use App\Application\Actions\Deficiencies\ToggleDeficiencyActiveAction;
use App\Application\Actions\Deficiencies\UpdateDeficiencyAction;
use App\Application\Data\Deficiencies\CreateDeficiencyData;
use App\Application\Data\Deficiencies\ListDeficienciesData;
use App\Application\Data\Deficiencies\UpdateDeficiencyData;
use App\Application\Queries\Deficiencies\ListDeficienciesQuery;
use App\Application\Queries\Deficiencies\ShowDeficiencyQuery;
use App\Domain\Models\Deficiency;
use App\Shared\Infrastructure\Security\RichTextSanitizer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Throwable;

final class DeficiencyController
{
    public function index(
        ListDeficienciesData $filters,
        ListDeficienciesQuery $query,
        Request $request,
    ): InertiaResponse {
        $deficiencies = $query->execute($filters);

        return Inertia::render(
            'Deficiencies/Index',
            [
                'deficiencies' => $deficiencies,
                'filters' => [
                    'name' => $filters->name ?? '',
                    'cid_code' => $filters->cidCode ?? '',
                    'is_active' => $filters->isActive === null ? '' : (string) (int) $filters->isActive,
                ],
                'can' => [
                    'create' => $request->user()?->can('deficiency.create') ?? false,
                    'view' => $request->user()?->can('deficiency.view') ?? false,
                    'update' => $request->user()?->can('deficiency.update') ?? false,
                    'delete' => $request->user()?->can('deficiency.delete') ?? false,
                ],
            ],
        );
    }

    public function show(Deficiency $deficiency, ShowDeficiencyQuery $query, Request $request): InertiaResponse
    {
        $deficiency = $query->execute($deficiency);

        return Inertia::render(
            'Deficiencies/Show',
            [
                'deficiency' => $deficiency,
                'descriptionHtml' => RichTextSanitizer::sanitize(
                    $deficiency->description ?: 'Nenhuma descrição técnica foi cadastrada para este perfil.',
                ),
                'can' => [
                    'update' => $request->user()?->can('deficiency.update') ?? false,
                    'delete' => $request->user()?->can('deficiency.delete') ?? false,
                ],
            ],
        );
    }

    public function create(): InertiaResponse
    {
        return Inertia::render('Deficiencies/Create');
    }

    public function store(
        CreateDeficiencyData $data,
        CreateDeficiencyAction $action,
    ): RedirectResponse {
        $action->execute($data);

        return redirect()
            ->route('specialized-educational-support.deficiencies.index')
            ->with('success', 'Deficiência criada com sucesso!');
    }

    public function edit(Deficiency $deficiency): InertiaResponse
    {
        return Inertia::render(
            'Deficiencies/Edit',
            compact('deficiency'),
        );
    }

    public function update(
        UpdateDeficiencyData $data,
        Deficiency $deficiency,
        UpdateDeficiencyAction $action,
    ): RedirectResponse {
        $action->execute($deficiency, $data);

        return redirect()
            ->route('specialized-educational-support.deficiencies.index')
            ->with('success', 'Deficiência atualizada com sucesso!');
    }

    /**
     * @throws Throwable
     */
    public function toggleActive(
        Deficiency $deficiency,
        ToggleDeficiencyActiveAction $action,
    ): RedirectResponse {
        $deficiency = $action->execute($deficiency);
        $message = $deficiency->is_active
            ? 'Deficiência ativada com sucesso!'
            : 'Deficiência desativada com sucesso!';

        return redirect()
            ->route('specialized-educational-support.deficiencies.show', $deficiency)
            ->with('success', $message);
    }

    /**
     * @throws Throwable
     */
    public function destroy(
        Deficiency $deficiency,
        DeleteDeficiencyAction $action,
    ): RedirectResponse {
        $action->execute($deficiency);

        return redirect()
            ->route('specialized-educational-support.deficiencies.index')
            ->with('success', 'Deficiência removida!');
    }
}
