<?php

declare(strict_types=1);

namespace App\Shared\Infrastructure\Http\Middleware;

use App\Domains\Auth\Domain\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class EnsureTeacherPortalAccess
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user instanceof User || $user->teacher_id === null) {
            abort(403, 'Acesso restrito a professores.');
        }

        return $next($request);
    }
}
