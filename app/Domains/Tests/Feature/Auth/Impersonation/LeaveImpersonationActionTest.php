<?php

declare(strict_types=1);

namespace App\Domains\Tests\Feature\Auth\Impersonation;

use App\Domains\Application\Actions\Auth\Impersonation\LeaveImpersonationAction;
use App\Domains\Domain\Exceptions\Auth\InvalidImpersonation;
use App\Domains\Domain\Models\Auth\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

final class LeaveImpersonationActionTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_leaves_impersonation_and_logs_original_super_admin_back_in(): void
    {
        $admin = User::factory()->create(['is_admin' => true, 'is_super_admin' => true]);
        $target = User::factory()->create(['is_admin' => true]);
        $this->actingAs($target);
        session(['impersonator_id' => $admin->id, 'impersonation_mode' => 'read_only']);

        $result = app(LeaveImpersonationAction::class)->execute();

        self::assertTrue($result->is($admin));
        self::assertSame($admin->id, Auth::id());
        self::assertFalse(session()->has('impersonator_id'));
        self::assertFalse(session()->has('impersonation_mode'));
        $this->assertDatabaseHas('audit_records', [
            'event' => 'inspection_ended',
            'actor_id' => $admin->id,
            'actor_name' => $admin->name,
            'entity_type' => 'user',
            'entity_id' => (string) $target->id,
            'impersonator_id' => null,
        ]);
    }

    public function test_it_rejects_when_impersonation_is_not_active(): void
    {
        session()->forget('impersonator_id');

        $this->expectException(InvalidImpersonation::class);
        $this->expectExceptionMessage('Você não está navegando como outro usuário.');

        app(LeaveImpersonationAction::class)->execute();
    }

    public function test_it_clears_session_and_rejects_invalid_original_admin(): void
    {
        session(['impersonator_id' => 999]);

        $this->expectException(InvalidImpersonation::class);
        $this->expectExceptionMessage('Administrador original inválido ou sem permissão.');

        try {
            app(LeaveImpersonationAction::class)->execute();
        } finally {
            self::assertFalse(session()->has('impersonator_id'));
            $this->assertDatabaseMissing('audit_records', ['event' => 'inspection_ended']);
        }
    }

    public function test_it_clears_session_and_rejects_common_admin_original_user(): void
    {
        $user = User::factory()->create(['is_admin' => true]);
        session(['impersonator_id' => $user->id]);

        $this->expectException(InvalidImpersonation::class);
        $this->expectExceptionMessage('Administrador original inválido ou sem permissão.');

        try {
            app(LeaveImpersonationAction::class)->execute();
        } finally {
            self::assertFalse(session()->has('impersonator_id'));
            $this->assertDatabaseMissing('audit_records', ['event' => 'inspection_ended']);
        }
    }
}
