<?php

declare(strict_types=1);

namespace App\Domains\Auth\UI\Controllers;

use App\Domains\Auth\Application\Actions\Sessions\LockSessionAction;
use App\Domains\Auth\Application\Actions\Sessions\RecordSessionActivityAction;
use App\Domains\Auth\Application\Actions\Sessions\UnlockSessionAction;
use App\Domains\Auth\Application\Data\Sessions\SessionActivityData;
use App\Domains\Auth\Application\Data\Sessions\UnlockSessionData;
use App\Domains\Auth\Application\Queries\Sessions\GetSessionSecurityStateQuery;
use App\Domains\Auth\Domain\Exceptions\InvalidSessionUnlock;
use App\Domains\Auth\UI\Presenters\SessionSecurityPresenter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class SessionController
{
    public function __construct(private readonly SessionSecurityPresenter $presenter) {}

    public function show(Request $request, GetSessionSecurityStateQuery $query): Response|RedirectResponse
    {
        $state = $query->execute($request->user());
        if (! $state->locked) {
            return redirect($state->returnTo ?? $this->presenter->home($request->user()));
        }
        Inertia::clearHistory();

        return Inertia::render('Auth/LockScreen', [
            'lockedUser' => $request->user()->only(['name', 'photo_url']),
        ]);
    }

    public function lock(
        SessionActivityData $data,
        Request $request,
        LockSessionAction $action,
    ): RedirectResponse {
        $action->execute($request->user(), $data);

        return redirect()->route('session.locked');
    }

    public function status(Request $request, GetSessionSecurityStateQuery $query): JsonResponse
    {
        return response()->json($this->presenter->present($request->user(), $query->execute($request->user())))
            ->header('Cache-Control', 'no-store');
    }

    public function activity(
        SessionActivityData $data,
        Request $request,
        RecordSessionActivityAction $action,
    ): JsonResponse {
        $state = $action->execute($request->user(), $data->returnTo);

        return response()->json($this->presenter->present($request->user(), $state))
            ->header('Cache-Control', 'no-store');
    }

    public function unlock(UnlockSessionData $data, Request $request, UnlockSessionAction $action): RedirectResponse
    {
        try {
            $state = $action->execute($request->user(), $data, (string) $request->ip());
        } catch (InvalidSessionUnlock $exception) {
            return back()->withErrors(['password' => $exception->getMessage()]);
        }
        if ($state->expired) {
            return redirect()->route('session.locked');
        }

        return redirect($state->returnTo ?? $this->presenter->home($request->user()))
            ->with('success', 'Sessão desbloqueada.');
    }
}
