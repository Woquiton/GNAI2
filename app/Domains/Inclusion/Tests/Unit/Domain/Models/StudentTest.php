<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Tests\Unit\Domain\Models;

use App\Domains\Inclusion\Domain\DTOs\Students\UpdateStudentDTO;
use App\Domains\Inclusion\Domain\Enums\AttendanceType;
use App\Domains\Inclusion\Domain\Enums\StudentStatus;
use App\Domains\Inclusion\Domain\Exceptions\InvalidStudent;
use App\Domains\Inclusion\Domain\Models\Student;
use App\Domains\Inclusion\Domain\ValueObjects\Registration;
use Tests\TestCase;

final class StudentTest extends TestCase
{
    public function test_it_allows_attendance_only_for_active_students_with_a_compatible_follow_up_type(): void
    {
        $student = new Student(['status' => 'active', 'follow_up_type' => 'aee']);

        self::assertTrue($student->allowsAttendanceType(AttendanceType::AEE));
        self::assertFalse($student->allowsAttendanceType(AttendanceType::PEDAGOGICAL));

        $student->follow_up_type = 'pedagogical';
        self::assertFalse($student->allowsAttendanceType('aee'));
        self::assertTrue($student->allowsAttendanceType('pedagogical'));

        $student->follow_up_type = 'both';
        self::assertTrue($student->allowsAttendanceType('aee'));
        self::assertTrue($student->allowsAttendanceType('pedagogical'));
        self::assertFalse($student->allowsAttendanceType('unknown'));

        foreach (['locked', 'completed', 'dropped'] as $status) {
            $student->status = $status;
            self::assertFalse($student->allowsAttendanceType('aee'));
            self::assertFalse($student->allowsAttendanceType('pedagogical'));
        }

        $student->status = 'active';
        $student->follow_up_type = null;
        self::assertFalse($student->allowsAttendanceType('aee'));
        self::assertFalse($student->allowsAttendanceType('pedagogical'));
    }

    public function test_it_cannot_reactivate_a_student_without_defining_the_follow_up_type(): void
    {
        $student = new Student(['status' => 'locked', 'follow_up_type' => null]);

        $this->expectException(InvalidStudent::class);

        $student->revise(new UpdateStudentDTO(
            registration: Registration::from('MAT001'),
            status: StudentStatus::ACTIVE,
            followUpType: null,
        ));
    }
}
