<?php

declare(strict_types=1);

namespace App\Domains\Tests\Feature\StudentCourses;

use App\Domains\Domain\Models\Courses\Course;
use App\Domains\Application\Actions\Disciplines\DeleteDisciplineAction;
use App\Domains\Domain\Exceptions\Disciplines\InvalidDiscipline;
use App\Domains\Domain\Models\Disciplines\Discipline;
use App\Domains\Domain\Models\Semesters\Semester;
use App\Domains\Domain\Enums\StudentCourses\StudentCourseDisciplineCategory;
use App\Domains\Domain\Models\StudentCourses\StudentCourse;
use App\Domains\Domain\Models\Students\Student;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class StudentCourseDisciplinesTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_syncs_failed_and_at_risk_disciplines_independently(): void
    {
        $studentCourse = $this->createStudentCourse();
        $semester = Semester::factory()->create();
        $discipline = Discipline::factory()->create(['name' => 'Matemática']);

        $studentCourse->syncFailedDisciplines($semester->id, [$discipline->id]);
        $studentCourse->syncAtRiskDisciplines($semester->id, [$discipline->id]);
        $studentCourse->syncFailedDisciplines($semester->id, []);

        $this->assertDatabaseMissing('student_course_disciplines', [
            'student_course_id' => $studentCourse->id,
            'category' => StudentCourseDisciplineCategory::FAILED->value,
        ]);
        $this->assertDatabaseHas('student_course_disciplines', [
            'student_course_id' => $studentCourse->id,
            'semester_id' => $semester->id,
            'discipline_id' => $discipline->id,
            'category' => StudentCourseDisciplineCategory::AT_ACADEMIC_RISK->value,
        ]);
    }

    public function test_it_rejects_deleting_a_discipline_used_in_a_student_course_record(): void
    {
        $studentCourse = $this->createStudentCourse();
        $discipline = Discipline::factory()->create(['name' => 'Língua Portuguesa']);
        $studentCourse->syncAtRiskDisciplines(Semester::factory()->create()->id, [$discipline->id]);

        $this->expectException(InvalidDiscipline::class);
        $this->expectExceptionMessage(
            "Não é possível excluir a disciplina 'Língua Portuguesa' pois ela possui registros no histórico de cursos de alunos."
        );

        app(DeleteDisciplineAction::class)->execute($discipline);
    }

    private function createStudentCourse(): StudentCourse
    {
        return StudentCourse::query()->create([
            'student_id' => Student::factory()->active()->create()->id,
            'course_id' => Course::factory()->create()->id,
            'academic_year' => 2026,
            'is_current' => true,
        ]);
    }
}
