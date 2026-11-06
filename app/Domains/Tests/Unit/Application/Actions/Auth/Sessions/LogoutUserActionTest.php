<?php

declare(strict_types=1);

namespace App\Domains\Tests\Unit\Application\Actions\Auth\Sessions;

use App\Domains\Application\Actions\Auth\Sessions\LogoutUserAction;
use App\Domains\Domain\DTOs\Auth\Sessions\LogoutSessionDTO;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

final class LogoutUserActionTest extends TestCase
{
    public function test_it_logs_out_and_clears_impersonation_state_by_default(): void
    {
        Auth::shouldReceive('logout')->once();
        session(['impersonator_id' => 1, 'impersonation_mode' => 'full']);

        app(LogoutUserAction::class)->execute();

        self::assertFalse(session()->has('impersonator_id'));
        self::assertFalse(session()->has('impersonation_mode'));
    }

    public function test_it_keeps_impersonation_state_when_requested(): void
    {
        Auth::shouldReceive('logout')->once();
        session(['impersonator_id' => 1, 'impersonation_mode' => 'full']);

        app(LogoutUserAction::class)->execute(new LogoutSessionDTO(clearImpersonation: false));

        self::assertSame(1, session('impersonator_id'));
        self::assertSame('full', session('impersonation_mode'));
    }
}
