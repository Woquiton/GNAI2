<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Auth\Impersonation;

use App\Domains\Application\Actions\Audit\RecordAuditActivityAction;
use App\Domains\Domain\Enums\Audit\AuditEvent;
use App\Domains\Domain\Enums\Auth\ImpersonationMode;
use App\Domains\Domain\Exceptions\Auth\InvalidImpersonation;
use App\Domains\Domain\Models\Auth\User;
use App\Domains\Infrastructure\Session\Auth\ImpersonationSession;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

final readonly class StartImpersonationAction
{
    public function __construct(
        private ImpersonationSession $impersonationSession,
    ) {}

    /**
     * @throws InvalidImpersonation
     */
    public function execute(User $impersonator, User $target, ImpersonationMode $mode): User
    {
        if (! $impersonator->isSuperAdmin()) {
            throw InvalidImpersonation::impersonatorMustBeSuperAdmin();
        }

        if ($target->is($impersonator)) {
            throw InvalidImpersonation::cannotImpersonateSelf();
        }

        if ($target->isSuperAdmin()) {
            throw InvalidImpersonation::cannotImpersonateSuperAdmin();
        }

        if (! $target->canAccessSystem()) {
            throw InvalidImpersonation::targetWithoutAccess();
        }

        app(RecordAuditActivityAction::class)->execute(
            AuditEvent::INSPECTED, 'user', (string) $target->getKey(),
            'o perfil '.$target->name, $impersonator, details: ['security_level' => 'elevated', 'mode' => $mode->value],
        );

        $this->impersonationSession->start((int) $impersonator->getKey(), $mode);

        Auth::login($target);

        Log::notice('Personificação iniciada.', [
            'impersonator_id' => $impersonator->getKey(),
            'target_id' => $target->getKey(),
            'mode' => $mode->value,
        ]);

        return $target;
    }
}
