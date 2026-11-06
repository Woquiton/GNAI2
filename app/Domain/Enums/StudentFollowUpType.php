<?php

declare(strict_types=1);

namespace App\Domain\Enums;

enum StudentFollowUpType: string
{
    case AEE = 'aee';
    case PEDAGOGICAL = 'pedagogical';
    case BOTH = 'both';

    public function label(): string
    {
        return match ($this) {
            self::AEE => 'Somente AEE',
            self::PEDAGOGICAL => 'Somente pedagógico',
            self::BOTH => 'AEE e pedagógico',
        };
    }

    public function allowsAttendanceType(AttendanceType|string $attendanceType): bool
    {
        $type = $attendanceType instanceof AttendanceType
            ? $attendanceType
            : AttendanceType::tryFrom($attendanceType);

        if ($type === null) {
            return false;
        }

        return match ($this) {
            self::AEE => $type === AttendanceType::AEE,
            self::PEDAGOGICAL => $type === AttendanceType::PEDAGOGICAL,
            self::BOTH => true,
        };
    }
}
