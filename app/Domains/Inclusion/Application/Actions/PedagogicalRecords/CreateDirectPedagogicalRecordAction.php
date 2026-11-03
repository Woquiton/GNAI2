<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Application\Actions\PedagogicalRecords;

use App\Domains\Inclusion\Application\Data\PedagogicalRecords\CreateDirectPedagogicalRecordData;
use App\Domains\Inclusion\Application\Services\Sessions\DirectAttendanceSessionRecorder;
use App\Domains\Inclusion\Domain\Enums\AttendanceType;
use App\Domains\Inclusion\Domain\Enums\SessionType;
use App\Domains\Inclusion\Domain\Models\PedagogicalRecord;
use App\Domains\Inclusion\Domain\Models\Session;
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
