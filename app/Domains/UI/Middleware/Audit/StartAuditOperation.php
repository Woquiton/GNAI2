<?php

declare(strict_types=1);

namespace App\Domains\UI\Middleware\Audit;

use App\Domains\Application\Actions\Audit\RecordAuditActivityAction;
use App\Domains\Domain\Enums\Audit\AuditEvent;
use App\Domains\Infrastructure\Audit\AuditContext;
use App\Domains\Infrastructure\Session\Auth\ImpersonationSession;
use App\Domains\UI\Presenters\Audit\AuditOperationPresenter;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

/**
 * Cada requisição é uma operação de auditoria: agrupa o que ela gravar e guarda os dados do log técnico.
 * Só o caminho da URL: a query string pode carregar tokens.
 */
final class StartAuditOperation
{
    public function __construct(private readonly AuditContext $context) {}

    public function handle(Request $request, Closure $next): Response
    {
        $this->context->start([
            'origin' => 'web',
            'route' => $request->route()?->getName(),
            'method' => $request->method(),
            'url' => '/'.ltrim($request->path(), '/'),
            'ip' => $request->ip(),
            'user_agent' => Str::limit((string) $request->userAgent(), 255, ''),
        ]);

        // Guarda as identidades antes que logout ou o fim da inspeção alterem a sessão.
        $actor = $this->context->actor();
        $impersonator = $this->context->impersonator();
        $mode = app(ImpersonationSession::class)->mode()?->value;
        $response = $next($request);
        $route = $request->route()?->getName();

        // Uma resposta de redirecionamento com erro não comprova uma operação concluída.
        $failed = $response->getStatusCode() >= 400
            || $request->session()->has('errors')
            || $request->session()->has('error');

        // Atualizações automáticas da sessão não são ações do usuário, nem consultas em inspeção.
        $sessionMaintenance = in_array($route, ['session.activity', 'session.status'], true);

        if ($actor === null || $route === null || $failed || $sessionMaintenance) {
            return $response;
        }

        $inspectionRead = $request->isMethod('GET') && $impersonator !== null;
        $untrackedWrite = ! $request->isMethodSafe() && ! $this->context->hasRecords();

        if ($inspectionRead || $untrackedWrite) {
            app(RecordAuditActivityAction::class)->execute(
                $inspectionRead ? AuditEvent::ACCESSED : AuditEvent::PROCESSED,
                'operation', substr(hash('sha256', (string) $route), 0, 64),
                app(AuditOperationPresenter::class)->description((string) $route),
                $actor, $impersonator,
                ['mode' => $mode, 'response_status' => $response->getStatusCode()],
            );
        }

        return $response;
    }
}
