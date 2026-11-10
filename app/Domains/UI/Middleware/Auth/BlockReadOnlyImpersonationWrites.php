<?php

declare(strict_types=1);

namespace App\Domains\UI\Middleware\Auth;

use App\Domains\Infrastructure\Session\Auth\ImpersonationSession;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Na personificação somente leitura, só consultas passam; encerrar a
 * personificação, sair e salvar as próprias preferências continuam permitidos.
 */
final class BlockReadOnlyImpersonationWrites
{
    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (
            $request->isMethodSafe()
            || ! $request->hasSession()
            || ! app(ImpersonationSession::class)->readOnly()
            || $request->routeIs(
                'admin.impersonate.leave', 'logout', 'session.activity',
                'preferences.color-palette.update', 'preferences.teacher-portal-view.update',
                'preferences.tables.columns.update', 'preferences.tables.view.update',
            )
        ) {
            return $next($request);
        }

        $message = 'Você está no modo somente leitura. Volte para a sua conta e entre novamente com acesso completo para fazer alterações.';

        if ($request->expectsJson() && ! $request->header('X-Inertia')) {
            return response()->json(['message' => $message], 403);
        }

        return redirect()->back()->with('warning', $message);
    }
}
