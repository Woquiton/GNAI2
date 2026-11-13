<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Auth\Impersonation;

use App\Domains\Application\Actions\Audit\RecordAuditActivityAction;
use App\Domains\Application\Queries\Auth\Users\FindUserByIdQuery;
use App\Domains\Domain\Enums\Audit\AuditEvent;
use App\Domains\Domain\Exceptions\Auth\InvalidImpersonation;
use App\Domains\Domain\Models\Auth\User;
use App\Domains\Infrastructure\Session\Auth\ImpersonationSession;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

final readonly class LeaveImpersonationAction
{
    public function __construct(
        private ImpersonationSession $impersonationSession,
        private FindUserByIdQuery $users,
    ) {}

    /**
     * @throws InvalidImpersonation
     */
    public function execute(): User
    {
        $impersonatorId = $this->impersonationSession->impersonatorId();

        if ($impersonatorId === null) {
            throw InvalidImpersonation::notActive();
        }

        $impersonator = $this->users->execute($impersonatorId);

        if (! $impersonator instanceof User || ! $impersonator->isSuperAdmin()) {
            $this->impersonationSession->clear();

            throw InvalidImpersonation::invalidImpersonator();
        }

        $target = Auth::user();
        app(RecordAuditActivityAction::class)->execute(
            AuditEvent::INSPECTION_ENDED, 'user', (string) $target?->getAuthIdentifier(),
            'o perfil '.($target?->name ?? 'desconhecido'), $impersonator,
            details: ['security_level' => 'elevated', 'mode' => $this->impersonationSession->mode()?->value],
        );

        $this->impersonationSession->clear();

        Auth::login($impersonator);

        Log::notice('Personificação encerrada.', [
            'impersonator_id' => $impersonator->getKey(),
        ]);

        return $impersonator;
    }
}
