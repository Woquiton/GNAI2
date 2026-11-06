<?php

declare(strict_types=1);

namespace App\Domains\UI\Middleware\Settings;

use App\Domains\Application\Queries\Settings\GetSessionSecuritySettingsQuery;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/** Aplica o prazo antes de o Laravel carregar a sessão e validar sua expiração. */
final class ConfigureSessionLifetime
{
    public function handle(Request $request, Closure $next): Response
    {
        $settings = app(GetSessionSecuritySettingsQuery::class)->execute();
        config(['session.lifetime' => max((int) config('session.lifetime'), $settings->logoutAfter)]);

        return $next($request);
    }
}
