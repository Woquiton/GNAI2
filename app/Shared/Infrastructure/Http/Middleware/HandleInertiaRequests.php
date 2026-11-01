<?php

declare(strict_types=1);

namespace App\Shared\Infrastructure\Http\Middleware;

use App\Domains\Auth\Application\Queries\Preferences\TablePreferencesQuery;
use App\Domains\Auth\Domain\Models\User;
use App\Domains\Auth\Infrastructure\Session\ImpersonationSession;
use App\Shared\Infrastructure\Navigation\AppNavigation;
use App\Shared\Infrastructure\Navigation\AppTopbar;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Middleware;

final class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'inertia';

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => fn () => $request->user()?->only([
                    'id', 'name', 'email', 'is_admin', 'role',
                    'professional_id', 'teacher_id', 'photo_url',
                ]),
            ],
            'navigation' => fn () => app(AppNavigation::class)->forRequest($request),
            'topbar' => fn () => app(AppTopbar::class)->forRequest($request),
            'impersonating' => fn () => $request->session()->has('impersonator_id'),
            'impersonationReadOnly' => fn () => app(ImpersonationSession::class)->readOnly(),
            'tablePreferences' => fn () => $this->tablePreferences($request),
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
     * @return array{route: string|null, columns: array<string, array<string, bool>>}
     */
    private function tablePreferences(Request $request): array
    {
        $user = $request->user();
        $routeName = $request->route()?->getName();

        return [
            'route' => is_string($routeName) ? $routeName : null,
            'columns' => $user instanceof User && is_string($routeName)
                ? app(TablePreferencesQuery::class)->columns($user, $routeName)
                : [],
        ];
    }
}
