<?php

declare(strict_types=1);

namespace Tests\Feature\Students;

use App\Application\Data\Students\ListStudentsData;
use App\Application\Queries\Students\ListStudentsQuery;
use App\Domain\Models\Course;
use App\Domain\Models\Deficiency;
use App\Domain\Models\Student;
use App\Domain\Models\StudentCourse;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class ListStudentsQueryTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_filters_follow_up_type_independently_from_student_status(): void
    {
        $aee = Student::factory()->active()->create(['follow_up_type' => 'aee']);
        $locked = Student::factory()->create(['status' => 'locked', 'follow_up_type' => 'aee']);
        Student::factory()->active()->create(['follow_up_type' => 'both']);
        $unknown = Student::factory()->create(['status' => 'dropped', 'follow_up_type' => null]);
        $query = app(ListStudentsQuery::class);

        $aeeStudents = $query->execute(ListStudentsData::from(['follow_up_type' => 'aee']));
        $activeAee = $query->execute(ListStudentsData::from(['status' => 'active', 'follow_up_type' => 'aee']));
        $notInformed = $query->execute(ListStudentsData::from(['follow_up_type' => 'not_informed']));

        self::assertEqualsCanonicalizing([$aee->id, $locked->id], $aeeStudents->pluck('id')->all());
        self::assertSame([$aee->id], $activeAee->pluck('id')->all());
        self::assertSame([$unknown->id], $notInformed->pluck('id')->all());
    }

    public function test_it_filters_students_by_current_course_or_deficiency_including_missing_ones(): void
    {
        $course = Course::factory()->create();
        $deficiency = Deficiency::factory()->create();
        $enrolled = Student::factory()->active()->create();
        StudentCourse::query()->create([
            'student_id' => $enrolled->id,
            'course_id' => $course->id,
            'academic_year' => 2026,
            'is_current' => true,
        ]);
        $withDeficiency = Student::factory()->active()->create();
        $withDeficiency->deficiencies()->attach($deficiency);
        $query = app(ListStudentsQuery::class);

        $fromCourse = $query->execute(ListStudentsData::from(['course_id' => (string) $course->id]));
        $withoutCourse = $query->execute(ListStudentsData::from(['course_id' => '0']));
        $fromDeficiency = $query->execute(ListStudentsData::from(['deficiency_id' => (string) $deficiency->id]));
        $withoutDeficiency = $query->execute(ListStudentsData::from(['deficiency_id' => '0']));

        self::assertSame([$enrolled->id], $fromCourse->pluck('id')->all());
        self::assertSame([$withDeficiency->id], $withoutCourse->pluck('id')->all());
        self::assertSame([$withDeficiency->id], $fromDeficiency->pluck('id')->all());
        self::assertSame([$enrolled->id], $withoutDeficiency->pluck('id')->all());
    }
}
