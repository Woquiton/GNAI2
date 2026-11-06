<?php

declare(strict_types=1);

namespace App\Domains\UI\Controllers\Auth;

use App\Domains\Application\Actions\Auth\Passwords\ResetPasswordAction;
use App\Domains\Application\Data\Auth\Passwords\ResetPasswordData;
use App\Domains\Domain\Exceptions\Auth\InvalidPasswordReset;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

final class ResetPasswordController
{
    public function showForm(Request $request, string $token): InertiaResponse
    {
        return Inertia::render('Auth/ResetPassword', [
            'token' => $token,
            'email' => $request->string('email')->toString(),
        ]);
    }

    public function reset(ResetPasswordData $data, ResetPasswordAction $action): RedirectResponse
    {
        try {
            $action->execute($data);
        } catch (InvalidPasswordReset $exception) {
            return back()
                ->withInput([
                    'token' => $data->token,
                    'email' => $data->email,
                ])
                ->withErrors(['email' => $exception->getMessage()]);
        }

        return redirect()
            ->route('login')
            ->with('success', 'Senha alterada!');
    }
}
