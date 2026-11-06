<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Sessions;

use App\Domains\Application\Data\Sessions\CancelSessionData;
use App\Domains\Application\Services\Sessions\SessionNotificationSender;
use App\Domains\Domain\Models\Sessions\Session;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class CancelSessionAction
{
    public function __construct(
        private SessionNotificationSender $notifications,
    ) {}

    /**
     * @throws Throwable
     */
    public function execute(Session $session, CancelSessionData $data, int $userId): Session
    {
        $session->ensureCreatedBy($userId, 'cancelá-la');
        $session->ensureCanBeCancelled();

        $cancelledSession = DB::transaction(function () use ($session, $data): Session {
            $lockedSession = Session::query()
                ->lockForUpdate()
                ->findOrFail($session->getKey());

            $lockedSession->ensureCanBeCancelled();
            $lockedSession->cancel($data->cancellationReason);
            $lockedSession->save();

            return $lockedSession->fresh(['students.person', 'professional.person', 'aeeRecord', 'pedagogicalRecord']);
        });

        $this->notifications->send(
            $cancelledSession,
            'session_cancelled',
            'Agendamento Cancelado',
            "Informamos que o seu agendamento foi cancelado. Motivo: {$data->cancellationReason}",
        );

        return $cancelledSession;
    }
}
