<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\PedagogicalRecords;

use App\Domains\Application\Data\PedagogicalRecords\UpdatePedagogicalRecordData;
use App\Domains\Domain\DTOs\PedagogicalRecords\PedagogicalRecordDTO;
use App\Domains\Domain\Exceptions\PedagogicalRecords\InvalidPedagogicalRecord;
use App\Domains\Domain\Models\PedagogicalRecords\PedagogicalRecord;
use App\Domains\Application\Services\Sessions\DirectAttendanceSessionRecorder;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class UpdatePedagogicalRecordAction
{
    public function __construct(
        private DirectAttendanceSessionRecorder $sessions,
    ) {}

    /** @throws Throwable */
    public function execute(PedagogicalRecord $pedagogicalRecord, UpdatePedagogicalRecordData $data, int $professionalId): PedagogicalRecord
    {
        return DB::transaction(function () use ($pedagogicalRecord, $data, $professionalId): PedagogicalRecord {
            $record = PedagogicalRecord::query()->with([
                'attendanceSession.students.guardians.person',
            ])->lockForUpdate()->findOrFail($pedagogicalRecord->getKey());
            if ((int) $record->attendanceSession->professional_id !== $professionalId) {
                throw new InvalidPedagogicalRecord('Apenas o profissional vinculado ao agendamento pode editar o registro pedagógico.');
            }
            $guardianIds = $data->withGuardians ? $data->guardianIds : [];
            $this->ensureGuardiansBelongToStudent($record, $guardianIds);
            $this->sessions->correct($record->attendanceSession, [
                'session_date' => $data->sessionDate,
                'start_time' => $data->startTime,
                'end_time' => $data->endTime,
                'location' => $data->location,
            ]);
            $record->revise(new PedagogicalRecordDTO(
                followUpReason: $data->followUpReason,
                duration: $data->duration,
                isPresent: $data->isPresent,
                absenceReason: $data->absenceReason,
                systematicPedagogicalFollowUpRecord: $data->systematicPedagogicalFollowUpRecord,
                strategiesAndResourcesAdopted: $data->strategiesAndResourcesAdopted,
                referralsMade: $data->referralsMade,
                complementaryObservations: $data->complementaryObservations,
                withGuardians: $data->withGuardians,
            ));
            $record->save();
            $record->syncGuardians($guardianIds);

            return $record->fresh([
                'attendanceSession.students.person',
                'attendanceSession.professional.person',
                'guardians.person',
            ]);
        });
    }

    /** @param list<int> $guardianIds */
    private function ensureGuardiansBelongToStudent(PedagogicalRecord $record, array $guardianIds): void
    {
        $allowedIds = $record->attendanceSession->students->first()?->guardians
            ->pluck('id')
            ->map(static fn (mixed $id): int => (int) $id)
            ->all() ?? [];

        if (array_diff(array_map('intval', $guardianIds), $allowedIds) !== []) {
            throw new InvalidPedagogicalRecord('Os responsáveis selecionados devem estar vinculados ao estudante do atendimento.');
        }
    }
}
