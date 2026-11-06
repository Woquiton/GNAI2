<?php

declare(strict_types=1);

namespace App\Application\Actions\AeeRecords;

use App\Application\Data\AeeRecords\CreateDirectAeeRecordData;
use App\Application\Services\Sessions\DirectAttendanceSessionRecorder;
use App\Domain\Enums\AttendanceType;
use App\Domain\Models\AeeRecord;
use App\Domain\Models\Session;
use Throwable;

/** Registra um atendimento AEE já realizado, criando o agendamento dele na mesma operação. */
final readonly class CreateDirectAeeRecordAction
{
    public function __construct(
        private DirectAttendanceSessionRecorder $sessions,
        private CreateAeeRecordAction $createRecord,
    ) {}

    /** @throws Throwable */
    public function execute(CreateDirectAeeRecordData $data, int $professionalId, int $creatorId): AeeRecord
    {
        return $this->sessions->record(
            AttendanceType::AEE,
            [
                'student_ids' => $data->studentIds,
                'type' => $data->type->value,
                'session_date' => $data->sessionDate,
                'start_time' => $data->startTime,
                'end_time' => $data->endTime,
                'location' => $data->location,
                'session_objective' => $data->activitiesPerformed,
            ],
            $professionalId,
            $creatorId,
            fn (Session $session): AeeRecord => $this->createRecord->execute(
                $data->recordFor((int) $session->getKey()),
                $professionalId,
            ),
        );
    }
}
