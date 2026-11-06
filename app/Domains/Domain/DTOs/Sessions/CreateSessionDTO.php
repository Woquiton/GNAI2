<?php

declare(strict_types=1);

namespace App\Domains\Domain\DTOs\Sessions;

use App\Domains\Domain\Enums\Sessions\AttendanceType;
use App\Domains\Domain\Enums\Sessions\SessionOrigin;
use App\Domains\Domain\Enums\Sessions\SessionStatus;
use App\Domains\Domain\Enums\Sessions\SessionType;

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
