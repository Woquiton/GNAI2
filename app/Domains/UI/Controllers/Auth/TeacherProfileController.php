<?php

declare(strict_types=1);

namespace App\Domains\UI\Controllers\Auth;

use App\Domains\Application\Actions\Auth\Profiles\UpdateTeacherProfileAction;
use App\Domains\Application\Data\Auth\Profiles\UpdateTeacherProfileData;
use App\Domains\Application\Queries\Auth\Profiles\EditTeacherProfileQuery;
use App\Domains\Application\Resolvers\Auth\AuthenticatedUserResolver;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class TeacherProfileController
{
    public function edit(
        Request $request,
        AuthenticatedUserResolver $authenticatedUser,
        EditTeacherProfileQuery $query,
    ): Response {
        return Inertia::render('TeacherPortal/Profile', $query->execute(
            $authenticatedUser->fromRequest($request),
        ));
    }

    public function update(
        UpdateTeacherProfileData $data,
        UpdateTeacherProfileAction $action,
        Request $request,
        AuthenticatedUserResolver $authenticatedUser,
    ): RedirectResponse {
        $action->execute($authenticatedUser->fromRequest($request), $data);

        return back()->with('success', 'Seu perfil foi atualizado com sucesso!');
    }
}
