<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Auth\Sessions;

use App\Domains\Application\Actions\Audit\RecordAuditActivityAction;
use App\Domains\Domain\DTOs\Auth\Sessions\LogoutSessionDTO;
use App\Domains\Domain\Enums\Audit\AuditEvent;
use App\Domains\Infrastructure\Audit\AuditContext;
use Illuminate\Support\Facades\Auth;

final readonly class LogoutUserAction
{
    public function execute(?LogoutSessionDTO $data = null): void
    {
        $dataDTO = $data ?? new LogoutSessionDTO;

        $context = app(AuditContext::class);
        $actor = $context->actor();

        if ($actor !== null) {
            app(RecordAuditActivityAction::class)->execute(
                AuditEvent::LOGOUT, 'user', (string) $actor->getKey(), 'sua conta',
                $actor, $context->impersonator(),
            );
        }

        if ($dataDTO->clearImpersonation) {
            session()->forget(['impersonator_id', 'impersonation_mode']);
        }

        Auth::logout();
    }
}
