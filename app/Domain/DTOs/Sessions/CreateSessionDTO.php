<?php

declare(strict_types=1);

namespace App\Domain\DTOs\Sessions;

use App\Domain\Enums\AttendanceType;
use App\Domain\Enums\SessionOrigin;
use App\Domain\Enums\SessionStatus;
use App\Domain\Enums\SessionType;

final readonly class CreateSessionDTO
{
    /**
     * @param list<int> $studentIds
     */
    public function __construct(
        public int $professionalId,
        public int $creatorId,
        public array $studentIds,
        public string $sessionDate,
        public string $startTime,
        public string $endTime,
        public SessionType $type,
        public AttendanceType $attendanceType,
        public string $location,
        public string $sessionObjective,
        public string $status = SessionStatus::SCHEDULED_DATABASE_VALUE,
        public SessionOrigin $origin = SessionOrigin::SCHEDULING,
    ) {}
}
