<?php

declare(strict_types=1);

namespace App\Domains\UI\Controllers\Auth;

use App\Domains\Application\Actions\Auth\Profiles\UpdateAccountProfileAction;
use App\Domains\Application\Actions\Auth\Profiles\UpdateProfileAction;
use App\Domains\Application\Data\Auth\Profiles\UpdateAccountProfileData;
use App\Domains\Application\Data\Auth\Profiles\UpdateProfileData;
use App\Domains\Application\Queries\Auth\Profiles\EditAccountProfileQuery;
use App\Domains\Application\Queries\Auth\Profiles\EditProfileQuery;
use App\Domains\Application\Resolvers\Auth\AuthenticatedUserResolver;
use App\Domains\Domain\Exceptions\Auth\InvalidProfile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Throwable;

final class ProfileController
{
    public function edit(
        EditProfileQuery $query,
        EditAccountProfileQuery $accountQuery,
        AuthenticatedUserResolver $authenticatedUser,
        Request $request,
    ): InertiaResponse|RedirectResponse {
        $user = $authenticatedUser->fromRequest($request);

        if ($user->teacher_id !== null && $user->professional_id === null && ! $user->isAdmin()) {
            return redirect()->route('teacher-portal.profile.edit');
        }

        // Contas sem vínculo com a equipe (ex.: administrador superior) têm apenas o perfil de conta.
        if (! $user->hasPersonProfile()) {
            return Inertia::render('Profile/Account', $accountQuery->execute($user));
        }

        try {
            return Inertia::render(
                'Profile/Edit',
                $query->execute($user),
            );
        } catch (InvalidProfile $exception) {
            return redirect()->route('dashboard')
                ->with('error', $exception->getMessage());
        }
    }

    /**
     * @throws Throwable
     */
    public function update(
        UpdateProfileData $data,
        UpdateProfileAction $action,
        AuthenticatedUserResolver $authenticatedUser,
        Request $request,
    ): RedirectResponse {
        $action->execute($authenticatedUser->fromRequest($request), $data);

        return back()->with('success', 'Seu perfil foi atualizado com sucesso!');
    }

    /**
     * @throws Throwable
     */
    public function updateAccount(
        UpdateAccountProfileData $data,
        UpdateAccountProfileAction $action,
        AuthenticatedUserResolver $authenticatedUser,
        Request $request,
    ): RedirectResponse {
        $action->execute($authenticatedUser->fromRequest($request), $data);

        return back()->with('success', 'Seu perfil foi atualizado com sucesso!');
    }
}
