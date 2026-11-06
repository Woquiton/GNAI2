<?php

declare(strict_types=1);

namespace App\UI\Controllers;

use App\Application\Actions\Disciplines\CreateDisciplineAction;
use App\Application\Actions\Disciplines\DeleteDisciplineAction;
use App\Application\Actions\Disciplines\UpdateDisciplineAction;
use App\Application\Data\Disciplines\CreateDisciplineData;
use App\Application\Data\Disciplines\ListDisciplinesData;
use App\Application\Data\Disciplines\UpdateDisciplineData;
use App\Application\Queries\Disciplines\ListDisciplinesQuery;
use App\Application\Queries\Disciplines\ShowDisciplineQuery;
use App\Domain\Models\Discipline;
use App\Shared\Infrastructure\Security\RichTextSanitizer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Throwable;

final class DisciplineController
{
    public function index(ListDisciplinesData $filters, ListDisciplinesQuery $query, Request $request): InertiaResponse
    {
        $disciplines = $query->execute($filters);

        return Inertia::render(
            'Disciplines/Index',
            [
                'disciplines' => $disciplines,
                'filters' => [
                    'name' => $filters->name ?? '',
                    'is_active' => $filters->isActive === null ? '' : (string) (int) $filters->isActive,
                ],
                'can' => [
                    'create' => $request->user()?->can('discipline.create') ?? false,
                    'view' => $request->user()?->can('discipline.view') ?? false,
                    'delete' => $request->user()?->can('discipline.delete') ?? false,
                ],
            ],
        );
    }

    public function show(Discipline $discipline, ShowDisciplineQuery $query, Request $request): InertiaResponse
    {
        $discipline = $query->execute($discipline);

        return Inertia::render(
            'Disciplines/Show',
            [
                'discipline' => $discipline,
                'display' => [
                    'descriptionHtml' => RichTextSanitizer::sanitize($discipline->description ?: 'Nenhuma descrição informada.'),
                ],
                'can' => [
                    'update' => $request->user()?->can('discipline.update') ?? false,
                    'delete' => $request->user()?->can('discipline.delete') ?? false,
                ],
            ],
        );
    }

    public function create(): InertiaResponse
    {
        return Inertia::render('Disciplines/Create');
    }

    public function store(CreateDisciplineData $data, CreateDisciplineAction $action): RedirectResponse
    {
        $action->execute($data);

        return redirect()
            ->route('specialized-educational-support.disciplines.index')
            ->with('success', 'Disciplina cadastrada com sucesso.');
    }

    public function edit(Discipline $discipline): InertiaResponse
    {
        return Inertia::render(
            'Disciplines/Edit',
            compact('discipline'),
        );
    }

    /**
     * @throws Throwable
     */
    public function update(UpdateDisciplineData $data, Discipline $discipline, UpdateDisciplineAction $action): RedirectResponse
    {
        $action->execute($discipline, $data);

        return redirect()
            ->route('specialized-educational-support.disciplines.index')
            ->with('success', 'Disciplina atualizada com sucesso.');
    }

    /**
     * @throws Throwable
     */
    public function destroy(Discipline $discipline, DeleteDisciplineAction $action): RedirectResponse
    {
        $action->execute($discipline);

        return redirect()
            ->route('specialized-educational-support.disciplines.index')
            ->with('success', 'Disciplina removida com sucesso.');
    }
}
