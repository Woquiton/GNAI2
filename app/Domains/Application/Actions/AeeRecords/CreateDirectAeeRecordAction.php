<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\AeeRecords;

use App\Domains\Application\Data\AeeRecords\CreateDirectAeeRecordData;
use App\Domains\Domain\Models\AeeRecords\AeeRecord;
use App\Domains\Application\Services\Sessions\DirectAttendanceSessionRecorder;
use App\Domains\Domain\Enums\Sessions\AttendanceType;
use App\Domains\Domain\Models\Sessions\Session;
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
