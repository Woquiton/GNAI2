<?php

declare(strict_types=1);

namespace App\Shared\Infrastructure\Http\Middleware;

use App\Domains\Application\Queries\Auth\Preferences\ColorPaletteQuery;
use App\Domains\Application\Queries\Auth\Preferences\PreferenceOwnerQuery;
use App\Domains\Application\Queries\Auth\Preferences\TeacherPortalViewQuery;
use App\Domains\Application\Queries\Auth\Preferences\TablePreferencesQuery;
use App\Domains\Application\Queries\Auth\Sessions\GetSessionSecurityStateQuery;
use App\Domains\Domain\Enums\Auth\PrimaryColorPalette;
use App\Domains\Domain\Models\Auth\User;
use App\Domains\Infrastructure\Session\Auth\ImpersonationSession;
use App\Domains\UI\Presenters\Auth\SessionSecurityPresenter;
use App\Shared\Infrastructure\Navigation\AppNavigation;
use App\Shared\Infrastructure\Navigation\AppTopbar;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Middleware;

final class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'inertia';

    public function share(Request $request): array
    {
        Inertia::encryptHistory($request->user() !== null);

        return [
            ...parent::share($request),
            'auth' => [
                'user' => fn () => $request->user()?->only([
                    'id', 'name', 'email', 'is_admin', 'role',
                    'professional_id', 'teacher_id', 'photo_url',
                ]),
            ],
            'usesTeacherPortal' => fn () => $request->user() instanceof User
                && $request->user()->teacher_id !== null
                && $request->user()->professional_id === null
                && ! $request->user()->isAdmin(),
            'sessionSecurity' => Inertia::always(function () use ($request) {
                // Esta prop só é resolvida ao preparar uma resposta Inertia, inclusive na primeira visita.
                $request->attributes->set('sessionSecurityInertiaResponse', true);
                $user = $request->user();

                return $user ? app(SessionSecurityPresenter::class)->present(
                    $user,
                    app(GetSessionSecurityStateQuery::class)->execute($user),
                ) : null;
            }),
            'navigation' => fn () => $request->routeIs('session.*')
                ? null : app(AppNavigation::class)->forRequest($request),
            'topbar' => fn () => $request->routeIs('session.*')
                ? null : app(AppTopbar::class)->forRequest($request),
            'impersonating' => fn () => $request->session()->has('impersonator_id'),
            'impersonationReadOnly' => fn () => app(ImpersonationSession::class)->readOnly(),
            'tablePreferences' => fn () => $this->tablePreferences($request),
            'colorPalette' => Inertia::always(fn () => $request->user() instanceof User
                ? app(ColorPaletteQuery::class)->execute(app(PreferenceOwnerQuery::class)->execute($request->user()))->value
                : PrimaryColorPalette::Lilac->value),
            'teacherPortalView' => Inertia::always(fn () => app(TeacherPortalViewQuery::class)
                ->execute(app(PreferenceOwnerQuery::class)->execute($request->user()))),
            'flash' => fn () => [
                'response_id' => (string) Str::uuid(),
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
                'warning' => $request->session()->get('warning'),
                'status' => $request->session()->get('status'),
            ],
        ];
    }

    /**
     * Rota da tela e colunas salvas pelo usuário nas tabelas dela.
     *
     * @return array{route: string|null, viewMode: string, columns: array<string, array<string, bool>>}
     */
    private function tablePreferences(Request $request): array
    {
        $user = app(PreferenceOwnerQuery::class)->execute($request->user());
        $routeName = $request->route()?->getName();

        return [
            'route' => is_string($routeName) ? $routeName : null,
            'viewMode' => $user instanceof User && is_string($routeName)
                ? app(TablePreferencesQuery::class)->viewMode($user, $routeName) : 'list',
            'columns' => $user instanceof User && is_string($routeName)
                ? app(TablePreferencesQuery::class)->columns($user, $routeName)
                : [],
        ];
    }
}
