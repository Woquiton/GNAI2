<?php

use App\Domains\Audit\UI\Middleware\StartAuditOperation;
use App\Domains\Auth\UI\Middleware\ApplyTablePageSize;
use App\Domains\Auth\UI\Middleware\EnforceSessionSecurity;
use App\Domains\Auth\UI\Middleware\BlockReadOnlyImpersonationWrites;
use App\Domains\Auth\UI\Middleware\EnsureUserIsAdmin;
use App\Domains\Settings\UI\Middleware\ConfigureSessionLifetime;
use App\Shared\Application\Exceptions\AccessDeniedException;
use App\Shared\Domain\Exceptions\BusinessRuleException;
use App\Shared\Infrastructure\Http\Middleware\EnsureTeacherPortalAccess;
use App\Shared\Infrastructure\Http\Middleware\ExpandJsonPayload;
use App\Shared\Infrastructure\Http\Middleware\HandleInertiaRequests;
use App\Shared\Infrastructure\Http\Middleware\SanitizeRichTextInput;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/saude',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->trustProxies(
            at: '*',
            headers: Request::HEADER_X_FORWARDED_FOR
                | Request::HEADER_X_FORWARDED_PROTO
                | Request::HEADER_X_FORWARDED_PREFIX
        );

        $middleware->web(prepend: [ConfigureSessionLifetime::class], append: [
            StartAuditOperation::class,
            EnforceSessionSecurity::class,
            HandleInertiaRequests::class,
            BlockReadOnlyImpersonationWrites::class,
            // Abre o `_payload` antes de sanitizar, para o texto rico ser tratado campo a campo.
            ExpandJsonPayload::class,
            SanitizeRichTextInput::class,
            ApplyTablePageSize::class,
        ]);

        $middleware->redirectTo(
            guests: 'autenticacao/entrar',
            users: 'autenticacao/painel'
        );
        $middleware->alias([
            'admin' => EnsureUserIsAdmin::class,
            'teacher-portal' => EnsureTeacherPortalAccess::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {

        // Tratamento para Regras de Negócio
        $exceptions->render(function (BusinessRuleException $e, Request $request) {
            if ($request->expectsJson()) {
                return response()->json(['message' => $e->getMessage()], 422);
            }

            return redirect()->back()
                ->withInput($request->except(['password', 'password_confirmation']))
                ->with('error', $e->getMessage());
        });

        // Acesso negado / autorização
        $exceptions->render(function (AccessDeniedException $e, Request $request) {
            if ($request->expectsJson()) {
                return response()->json(['message' => $e->getMessage()], 403);
            }

            return Inertia::render('Errors/Error', [
                'status' => 403,
                'homeHref' => route($request->user() ? 'dashboard' : 'login'),
            ])
                ->toResponse($request)->setStatusCode(403);
        });

        // Validação
        $exceptions->render(function (ValidationException $e, Request $request) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Dados inválidos.', 'errors' => $e->errors()], 422);
            }

            return redirect()->back()
                ->withErrors($e->errors())
                ->withInput($request->except(['password', 'password_confirmation']));
        });

        // Não Autenticado
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Não autenticado.'], 401);
            }

            return redirect()->guest(route('login'))->with('error', 'Faça login para continuar.');
        });

        // Model Not Found (404 de Banco)
        $exceptions->render(function (ModelNotFoundException $e, Request $request) {
            $msg = 'Recurso não encontrado.';

            return $request->expectsJson()
                ? response()->json(['message' => $msg], 404)
                : redirect()->back()->with('error', $msg);
        });

        // Erro de Banco (Query)
        $exceptions->render(function (QueryException $e, Request $request) {
            logger()->error('Erro de Banco: '.$e->getMessage());
            $msg = 'Erro interno no servidor.';

            return $request->expectsJson()
                ? response()->json(['message' => $msg], 500)
                : redirect()->back()->with('error', $msg);
        });

        $exceptions->respond(function (Response $response, Throwable $exception, Request $request): Response {
            $status = $response->getStatusCode();

            if ($request->expectsJson()) {
                return $response;
            }

            $hasErrorScreen = in_array($status, [400, 403, 404, 419, 429, 500, 503], true);

            if ($hasErrorScreen && ($status !== 500 || ! config('app.debug'))) {
                $errorResponse = Inertia::render('Errors/Error', [
                    'status' => $status,
                    'homeHref' => route($request->user() ? 'dashboard' : 'login'),
                ])
                    ->toResponse($request)->setStatusCode($status);

                if ($response->headers->has('Retry-After')) {
                    $errorResponse->headers->set('Retry-After', $response->headers->get('Retry-After'));
                }

                return $errorResponse;
            }

            return $response;
        });
    })->create();
