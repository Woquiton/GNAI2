<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\PedagogicalRecords;

use App\Domains\Domain\Exceptions\PedagogicalRecords\InvalidPedagogicalRecord;
use App\Domains\Domain\Models\PedagogicalRecords\PedagogicalRecord;
use App\Domains\Domain\Enums\Sessions\SessionStatus;
use Illuminate\Support\Facades\DB;
use Throwable;

final class DeletePedagogicalRecordAction
{
    /**
     * Devolve o agendamento ao status Agendada e retorna o id dele. Um agendamento criado pelo
     * registro direto só existia por causa do registro e é excluído junto (retorno `null`).
     *
     * @throws Throwable
     */
    public function execute(PedagogicalRecord $pedagogicalRecord, int $professionalId): ?int
    {
        return DB::transaction(function () use ($pedagogicalRecord, $professionalId): ?int {
            $record = PedagogicalRecord::query()->with('attendanceSession')->lockForUpdate()->findOrFail($pedagogicalRecord->getKey());
            if ((int) $record->attendanceSession->professional_id !== $professionalId) {
                throw new InvalidPedagogicalRecord('Apenas o profissional vinculado ao agendamento pode excluir o registro pedagógico.');
            }
            $session = $record->attendanceSession;
            $record->forceDelete();

            if ($session->isDirectRecord()) {
                $session->forceDelete();

                return null;
            }

            $session->update(['status' => SessionStatus::SCHEDULED_DATABASE_VALUE]);

            return (int) $session->getKey();
        });
    }
}
