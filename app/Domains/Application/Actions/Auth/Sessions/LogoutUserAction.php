<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Auth\Sessions;

use App\Domains\Domain\DTOs\Auth\Sessions\LogoutSessionDTO;
use Illuminate\Support\Facades\Auth;

final readonly class LogoutUserAction
{
    public function execute(?LogoutSessionDTO $data = null): void
    {
        $dataDTO = $data ?? new LogoutSessionDTO;

        if ($dataDTO->clearImpersonation) {
            session()->forget(['impersonator_id', 'impersonation_mode']);
        }

        Auth::logout();
    }
}
