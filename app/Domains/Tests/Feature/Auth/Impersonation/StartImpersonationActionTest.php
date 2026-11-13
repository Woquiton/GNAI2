<?php

declare(strict_types=1);

namespace App\Domains\Tests\Feature\Auth\Impersonation;

use App\Domains\Application\Actions\Auth\Impersonation\StartImpersonationAction;
use App\Domains\Domain\Enums\Auth\ImpersonationMode;
use App\Domains\Domain\Exceptions\Auth\InvalidImpersonation;
use App\Domains\Domain\Models\Auth\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

final class StartImpersonationActionTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_starts_impersonation_for_super_admin_with_chosen_mode(): void
    {
        $impersonator = $this->user(id: 1, isSuperAdmin: true);
        $target = $this->user(id: 2, isAdmin: true);

        $this->actingAs($impersonator);

        $result = app(StartImpersonationAction::class)->execute($impersonator, $target, ImpersonationMode::FULL);

        self::assertTrue($result->is($target));
        self::assertSame(1, session('impersonator_id'));
        self::assertSame('full', session('impersonation_mode'));
        self::assertSame($target->id, Auth::id());
        $this->assertDatabaseHas('audit_records', [
            'event' => 'inspected',
            'actor_id' => $impersonator->id,
            'actor_name' => $impersonator->name,
            'entity_type' => 'user',
            'entity_id' => (string) $target->id,
            'impersonator_id' => null,
        ]);
    }

    public function test_it_rejects_common_admin_impersonator(): void
    {
        $this->expectException(InvalidImpersonation::class);
        $this->expectExceptionMessage('Apenas o administrador superior do Gnai pode entrar como outro usuário.');

        app(StartImpersonationAction::class)->execute(
            $this->user(id: 1, isAdmin: true),
            $this->user(id: 2),
            ImpersonationMode::READ_ONLY,
        );
    }

    public function test_it_rejects_impersonating_another_super_admin(): void
    {
        $this->expectException(InvalidImpersonation::class);
        $this->expectExceptionMessage('Não é possível entrar como outro administrador superior.');

        app(StartImpersonationAction::class)->execute(
            $this->user(id: 1, isSuperAdmin: true),
            $this->user(id: 2, isSuperAdmin: true),
            ImpersonationMode::READ_ONLY,
        );
    }

    public function test_it_rejects_impersonating_self(): void
    {
        $user = $this->user(id: 1, isSuperAdmin: true);

        $this->expectException(InvalidImpersonation::class);
        $this->expectExceptionMessage('Não é possível entrar como você mesmo.');

        app(StartImpersonationAction::class)->execute($user, $user, ImpersonationMode::READ_ONLY);
    }

    public function test_it_rejects_target_without_system_access(): void
    {
        $this->expectException(InvalidImpersonation::class);
        $this->expectExceptionMessage('Este usuário não tem acesso ao sistema.');

        app(StartImpersonationAction::class)->execute(
            $this->user(id: 1, isSuperAdmin: true),
            $this->user(id: 2),
            ImpersonationMode::READ_ONLY,
        );
    }

    private function user(
        int $id,
        bool $isAdmin = false,
        bool $isSuperAdmin = false,
    ): User {
        return User::factory()->create([
            'id' => $id,
            'name' => "User {$id}",
            'email' => "user{$id}@example.test",
            'is_admin' => $isAdmin,
            'is_super_admin' => $isSuperAdmin,
            'professional_id' => null,
        ]);
    }
}
