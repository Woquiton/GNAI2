<?php

declare(strict_types=1);

namespace App\Domains\UI\Controllers\People;

use App\Domains\Application\Actions\People\SavePersonAction;
use App\Domains\Application\Data\People\ListPeopleData;
use App\Domains\Application\Data\People\SavePersonData;
use App\Domains\Application\Queries\People\ListPeopleQuery;
use App\Domains\Application\Queries\People\PersonFormQuery;
use App\Domains\Domain\Models\People\Person;
use App\Domains\UI\Presenters\People\PersonPagePresenter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class PersonController
{
    public function __construct(private readonly PersonPagePresenter $presenter) {}

    public function index(ListPeopleData $filters, Request $request, ListPeopleQuery $query): Response
    {
        $people = $query->execute($filters);
        $people->through(fn (Person $person): array => $this->presenter->listRow($person));

        return Inertia::render('People/Index', [
            'people' => $people,
            'filters' => [
                'email' => $filters->email ?? '',
                'phone' => $filters->phone ?? '',
                'created_from' => $filters->createdFrom ?? '',
                'created_to' => $filters->createdTo ?? '',
                'name' => $filters->name ?? '',
                'tag_id' => $filters->tagId === null ? '' : (string) $filters->tagId,
            ],
            'tags' => $query->tagOptions(),
            'can' => [
                'create' => $request->user()->can('person.create'),
                'edit' => $request->user()->can('person.update'),
            ],
        ]);
    }

    public function create(Request $request, PersonFormQuery $query): Response
    {
        return Inertia::render('People/Create', $query->execute($request->user()) + ['person' => null]);
    }

    public function edit(Person $person, Request $request, PersonFormQuery $query): Response
    {
        return Inertia::render('People/Edit', $query->execute($request->user(), $person) + [
            'person' => $this->presenter->person($person),
        ]);
    }

    public function store(SavePersonData $data, Request $request, SavePersonAction $action): RedirectResponse
    {
        $action->execute($data, $request->user());

        return redirect()->route('inclusive-radar.people.index')->with('success', 'Pessoa e seus cadastros registrados com sucesso!');
    }

    public function update(Person $person, SavePersonData $data, Request $request, SavePersonAction $action): RedirectResponse
    {
        $action->execute($data, $request->user(), $person);

        return redirect()->route('inclusive-radar.people.index')->with('success', 'Pessoa e seus cadastros atualizados com sucesso!');
    }
}
