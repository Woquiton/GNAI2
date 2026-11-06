<?php

declare(strict_types=1);

namespace App\Domains\UI\Controllers\Auth;

use App\Domains\Application\Actions\Auth\Impersonation\LeaveImpersonationAction;
use App\Domains\Application\Actions\Auth\Impersonation\StartImpersonationAction;
use App\Domains\Application\Actions\Auth\Sessions\StartSessionSecurityAction;
use App\Domains\Application\Data\Auth\Impersonation\StartImpersonationData;
use App\Domains\Domain\Models\Auth\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

final class ImpersonationController
{
    public function start(
        User $user,
        StartImpersonationData $data,
        StartImpersonationAction $action,
        Request $request,
    ): RedirectResponse {
        $target = $action->execute($request->user(), $user, $data->mode);
        app(StartSessionSecurityAction::class)->execute();

        return redirect()
            ->route('dashboard')
            ->with('success', 'Você entrou como '.$target->name.' ('.mb_strtolower($data->mode->label()).').');
    }

    public function leave(LeaveImpersonationAction $action): RedirectResponse
    {
        $action->execute();
        app(StartSessionSecurityAction::class)->execute();

        return redirect()
            ->route('dashboard')
            ->with('success', 'Você voltou para a sua conta de administrador superior.');
    }
}
