<?php

declare(strict_types=1);

namespace App\Domain\DTOs\StudentCourses;

final readonly class CreateStudentCourseDTO
{
    public function __construct(
        public int $academicYear,
        public ?int $semesterId = null,
        public bool $isCurrent = false,
        public ?string $schoolAttendanceStatus = null,
    ) {}
}
