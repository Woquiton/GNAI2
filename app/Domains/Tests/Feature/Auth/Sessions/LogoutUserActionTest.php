<?php

declare(strict_types=1);

namespace App\Domains\Tests\Feature\Auth\Sessions;

use App\Domains\Application\Actions\Auth\Sessions\LogoutUserAction;
use App\Domains\Domain\DTOs\Auth\Sessions\LogoutSessionDTO;
use App\Domains\Domain\Models\Auth\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

final class LogoutUserActionTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_logs_out_and_clears_impersonation_state_by_default(): void
    {
        $admin = User::factory()->create(['is_admin' => true, 'is_super_admin' => true]);
        $target = User::factory()->create(['is_admin' => true]);
        $this->actingAs($target);
        session(['impersonator_id' => $admin->id, 'impersonation_mode' => 'full']);
        $this->app['request']->setLaravelSession($this->app['session.store']);

        app(LogoutUserAction::class)->execute();

        self::assertFalse(Auth::check());
        self::assertFalse(session()->has('impersonator_id'));
        self::assertFalse(session()->has('impersonation_mode'));
        $this->assertDatabaseHas('audit_records', [
            'event' => 'logout',
            'actor_id' => $target->id,
            'actor_name' => $target->name,
            'impersonator_id' => $admin->id,
            'impersonator_name' => $admin->name,
        ]);
    }

    public function test_it_keeps_impersonation_state_when_requested(): void
    {
        $admin = User::factory()->create(['is_admin' => true, 'is_super_admin' => true]);
        $target = User::factory()->create(['is_admin' => true]);
        $this->actingAs($target);
        session(['impersonator_id' => $admin->id, 'impersonation_mode' => 'full']);
        $this->app['request']->setLaravelSession($this->app['session.store']);

        app(LogoutUserAction::class)->execute(new LogoutSessionDTO(clearImpersonation: false));

        self::assertFalse(Auth::check());
        self::assertSame($admin->id, session('impersonator_id'));
        self::assertSame('full', session('impersonation_mode'));
        $this->assertDatabaseHas('audit_records', [
            'event' => 'logout',
            'actor_id' => $target->id,
            'impersonator_id' => $admin->id,
        ]);
    }
}
