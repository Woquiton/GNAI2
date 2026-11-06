<?php

declare(strict_types=1);

namespace App\Application\Actions\PedagogicalRecords;

use App\Application\Data\PedagogicalRecords\CreateDirectPedagogicalRecordData;
use App\Application\Services\Sessions\DirectAttendanceSessionRecorder;
use App\Domain\Enums\AttendanceType;
use App\Domain\Enums\SessionType;
use App\Domain\Models\PedagogicalRecord;
use App\Domain\Models\Session;
use Throwable;

/** Registra um atendimento pedagógico já realizado, criando o agendamento dele na mesma operação. */
final readonly class CreateDirectPedagogicalRecordAction
{
    public function __construct(
        private DirectAttendanceSessionRecorder $sessions,
        private CreatePedagogicalRecordAction $createRecord,
    ) {}

    /** @throws Throwable */
    public function execute(CreateDirectPedagogicalRecordData $data, int $professionalId, int $creatorId): PedagogicalRecord
    {
        return $this->sessions->record(
            AttendanceType::PEDAGOGICAL,
            [
                'student_ids' => $data->studentIds,
                'type' => SessionType::INDIVIDUAL->value,
                'session_date' => $data->sessionDate,
                'start_time' => $data->startTime,
                'end_time' => $data->endTime,
                'location' => $data->location,
                'session_objective' => $data->followUpReason,
            ],
            $professionalId,
            $creatorId,
            fn (Session $session): PedagogicalRecord => $this->createRecord->execute(
                $data->recordFor((int) $session->getKey()),
                $professionalId,
            ),
        );
    }
}
