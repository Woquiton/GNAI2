<?php

declare(strict_types=1);

namespace App\Domains\UI\Middleware\Auth;

use App\Domains\Application\Actions\Auth\Preferences\SaveTablePreferenceAction;
use App\Domains\Application\Queries\Auth\Preferences\TablePreferencesQuery;
use App\Domains\Domain\Models\Auth\User;
use App\Domains\Domain\Models\Auth\UserTablePreference;
use App\Domains\Infrastructure\Session\Auth\ImpersonationSession;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Quantidade de registros por página lembrada por usuário e por tela (nome da rota).
 * Um `per_page` válido na consulta é gravado como escolha da tela; sem ele, a última
 * escolha é aplicada antes de o controller ler os filtros.
 */
final readonly class ApplyTablePageSize
{
    public function __construct(
        private TablePreferencesQuery $preferences,
        private SaveTablePreferenceAction $save,
        private ImpersonationSession $impersonation,
    ) {}

    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        $routeName = $request->route()?->getName();

        if (! $request->isMethod('GET') || ! $user instanceof User || ! is_string($routeName)) {
            return $next($request);
        }

        if ($request->query->has('per_page')) {
            $size = filter_var($request->query('per_page'), FILTER_VALIDATE_INT);

            // Na personificação a escolha vale só para a visita, sem alterar o usuário personificado.
            if (UserTablePreference::isPageSize($size) && ! $this->impersonation->active()) {
                $this->save->execute($user, $routeName, ['per_page' => $size]);
            }

            return $next($request);
        }

        $size = $this->preferences->pageSize($user, $routeName);
        if ($size !== null) {
            $request->query->set('per_page', (string) $size);
        }

        return $next($request);
    }
}
