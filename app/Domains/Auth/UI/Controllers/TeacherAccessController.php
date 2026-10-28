<?php

declare(strict_types=1);

namespace App\Domains\Auth\UI\Controllers;

use App\Domains\Auth\Application\Actions\TeacherAccess\ConfirmTeacherAccessTokenAction;
use App\Domains\Auth\Application\Actions\TeacherAccess\RequestTeacherAccessLinkAction;
use App\Domains\Auth\Application\Data\TeacherAccess\RequestTeacherAccessLinkData;
use App\Domains\Auth\Domain\Exceptions\InvalidTeacherAccessToken;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\View\View;
use Throwable;

final class TeacherAccessController
{
    private const MAX_ATTEMPTS_PER_EMAIL = 5;

    private const MAX_ATTEMPTS_PER_IP = 20;

    private const DECAY_SECONDS = 3600;

    public function showRequestForm(): View
    {
        return view('auth.teacher-access.request');
    }

    public function sendLink(RequestTeacherAccessLinkData $data, RequestTeacherAccessLinkAction $action, Request $request): RedirectResponse
    {
        $email = Str::lower(trim($data->email));
        $emailKey = 'teacher-access:email:'.$email;
        $ipKey = 'teacher-access:ip:'.$request->ip();

        if (RateLimiter::tooManyAttempts($emailKey, self::MAX_ATTEMPTS_PER_EMAIL)
            || RateLimiter::tooManyAttempts($ipKey, self::MAX_ATTEMPTS_PER_IP)) {
            return back()->with(
                'status',
                'Muitas tentativas. Aguarde um pouco antes de solicitar um novo link.',
            );
        }

        RateLimiter::hit($emailKey, self::DECAY_SECONDS);
        RateLimiter::hit($ipKey, self::DECAY_SECONDS);

        try {
            $action->execute($data, $request->ip());
        } catch (Throwable) {
            // Falha de envio já foi registrada em sent_emails; a resposta ao
            // usuário permanece genérica para não vazar se o e-mail existe.
        }

        return back()->with(
            'status',
            'Se este e-mail estiver cadastrado, você receberá um link de acesso.',
        );
    }

    public function showConfirm(string $token, Request $request): View
    {
        $this->logoutAnyExistingSession($request);

        return view('auth.teacher-access.confirm', ['token' => $token]);
    }

    public function confirm(string $token, ConfirmTeacherAccessTokenAction $action, Request $request): RedirectResponse
    {
        $this->logoutAnyExistingSession($request);

        try {
            $user = $action->execute($token);
        } catch (InvalidTeacherAccessToken $exception) {
            return redirect()
                ->route('teacher-access.request')
                ->with('status', $exception->getMessage());
        }

        Auth::login($user, remember: true);
        $request->session()->regenerate();

        return redirect()
            ->route('teacher-portal.index')
            ->with('success', 'Acesso confirmado com sucesso.');
    }

    /**
     * O link de acesso deve sempre autenticar exatamente a identidade do
     * token, nunca herdar uma sessão (de qualquer pessoa) que já estivesse
     * aberta no mesmo navegador/aparelho.
     */
    private function logoutAnyExistingSession(Request $request): void
    {
        if (Auth::check()) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }
    }
}
