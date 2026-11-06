<?php

declare(strict_types=1);

namespace App\UI\Controllers;

use App\Application\Actions\Semesters\CreateSemesterAction;
use App\Application\Actions\Semesters\DeleteSemesterAction;
use App\Application\Actions\Semesters\SetCurrentSemesterAction;
use App\Application\Actions\Semesters\UpdateSemesterAction;
use App\Application\Data\Semesters\CreateSemesterData;
use App\Application\Data\Semesters\ListSemestersData;
use App\Application\Data\Semesters\UpdateSemesterData;
use App\Application\Queries\Semesters\ListSemestersQuery;
use App\Application\Queries\Semesters\ShowSemesterQuery;
use App\Domain\Models\Semester;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Throwable;

final class SemesterController
{
    public function index(ListSemestersData $filters, ListSemestersQuery $query, Request $request): InertiaResponse
    {
        $semesters = $query->execute($filters);

        return Inertia::render(
            'Semesters/Index',
            [
                'semesters' => $semesters,
                'filters' => [
                    'year' => $filters->year === null ? '' : (string) $filters->year,
                    'term' => $filters->term === null ? '' : (string) $filters->term,
                    'label' => $filters->label ?? '',
                    'is_current' => $filters->isCurrent === null ? '' : (string) (int) $filters->isCurrent,
                ],
                'can' => [
                    'create' => $request->user()?->can('semester.create') ?? false,
                    'view' => $request->user()?->can('semester.view') ?? false,
                    'update' => $request->user()?->can('semester.update') ?? false,
                    'delete' => $request->user()?->can('semester.delete') ?? false,
                ],
            ],
        );
    }

    public function show(Semester $semester, ShowSemesterQuery $query, Request $request): InertiaResponse
    {
        $semester = $query->execute($semester);

        return Inertia::render(
            'Semesters/Show',
            [
                'semester' => $semester,
                'can' => [
                    'update' => $request->user()?->can('semester.update') ?? false,
                    'delete' => $request->user()?->can('semester.delete') ?? false,
                ],
            ],
        );
    }

    public function create(): InertiaResponse
    {
        return Inertia::render('Semesters/Create');
    }

    /**
     * @throws Throwable
     */
    public function store(CreateSemesterData $data, CreateSemesterAction $action): RedirectResponse
    {
        $action->execute($data);

        return redirect()
            ->route('specialized-educational-support.semesters.index')
            ->with('success', 'Semestre criado com sucesso.');
    }

    public function edit(Semester $semester): InertiaResponse
    {
        return Inertia::render(
            'Semesters/Edit',
            compact('semester'),
        );
    }

    /**
     * @throws Throwable
     */
    public function update(UpdateSemesterData $data, Semester $semester, UpdateSemesterAction $action): RedirectResponse
    {
        $action->execute($semester, $data);

        return redirect()
            ->route('specialized-educational-support.semesters.index')
            ->with('success', 'Semestre atualizado com sucesso.');
    }

    /**
     * @throws Throwable
     */
    public function setCurrent(Semester $semester, SetCurrentSemesterAction $action): RedirectResponse
    {
        $action->execute($semester);

        return redirect()
            ->route('specialized-educational-support.semesters.index')
            ->with('success', 'Semestre definido como atual.');
    }

    /**
     * @throws Throwable
     */
    public function destroy(Semester $semester, DeleteSemesterAction $action): RedirectResponse
    {
        $action->execute($semester);

        return redirect()
            ->route('specialized-educational-support.semesters.index')
            ->with('success', 'Semestre removido com sucesso.');
    }
}
