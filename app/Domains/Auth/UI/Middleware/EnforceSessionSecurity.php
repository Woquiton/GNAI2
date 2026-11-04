<?php

declare(strict_types=1);

namespace App\Domains\Auth\UI\Middleware;

use App\Domains\Auth\Application\Actions\Sessions\CheckSessionSecurityAction;
use App\Domains\Auth\Application\Actions\Sessions\LogoutUserAction;
use App\Domains\Auth\Application\Actions\Sessions\RememberSessionPageAction;
use App\Domains\Auth\UI\Presenters\SessionSecurityPresenter;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

final class EnforceSessionSecurity
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user() || $request->routeIs('logout', 'teacher-access.confirm*')) {
            return $next($request);
        }

        $state = app(CheckSessionSecurityAction::class)->execute($request->user());

        if ($state->expired || Auth::viaRemember()) {
            $destination = app(SessionSecurityPresenter::class)->login($request->user());
            app(LogoutUserAction::class)->execute();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            Inertia::clearHistory();
            $request->session()->flash('warning', 'Sua sessão foi encerrada por inatividade. Entre novamente para continuar.');

            return $this->redirect($request, $destination, 401);
        }

        if ($state->locked && ! $request->routeIs('session.*')) {
            return $this->redirect($request, route('session.locked', absolute: false), 423);
        }

        $response = $next($request);
        if (
            $request->isMethod('GET')
            && ! $request->routeIs('session.*')
            && $request->attributes->get('sessionSecurityInertiaResponse') === true
        ) {
            app(RememberSessionPageAction::class)->execute($request->user(), $request->getRequestUri());
        }
        $response->headers->set('Cache-Control', 'no-store, private');

        return $response;
    }

    private function redirect(Request $request, string $destination, int $status): Response
    {
        if ($request->header('X-Inertia')) {
            return Inertia::location($destination);
        }
        if ($request->expectsJson()) {
            return response()->json(['redirectTo' => $destination], $status);
        }

        return redirect($destination);
    }
}
