<?php

declare(strict_types=1);

namespace App\Domains\Domain\Models\StudentCourses;

use App\Domains\Domain\Contracts\Audit\Auditable;
use App\Domains\Domain\ValueObjects\Audit\AuditedField;
use App\Domains\Infrastructure\Eloquent\Audit\AuditsChanges;
use App\Domains\Domain\Models\Courses\Course;
use App\Domains\Domain\Models\Semesters\Semester;
use App\Domains\Domain\Exceptions\StudentCourses\InvalidStudentCourse;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/** Período do curso (semestre ou série) em que o aluno está em um semestre letivo da matrícula. */
final class StudentCourseSemester extends Model implements Auditable
{
    use AuditsChanges;

    protected $table = 'student_course_semesters';

    protected $fillable = [
        'student_course_id',
        'semester_id',
        'course_period',
    ];

    protected $casts = [
        'course_period' => 'integer',
    ];

    public static function auditType(): string
    {
        return 'student_course_semester';
    }

    public static function auditLabel(): string
    {
        return 'Período do Aluno no Semestre';
    }

    public static function auditedFields(): array
    {
        return [
            'student_course_id' => AuditedField::number('ID da matrícula'),
            'semester_id' => AuditedField::reference('Semestre', Semester::class, 'label'),
            'course_period' => AuditedField::number('Período do curso'),
        ];
    }

    public function auditDescription(): string
    {
        $semesterLabel = $this->semester?->label ?? "#{$this->semester_id}";

        return "o período do aluno no semestre {$semesterLabel} (matrícula #{$this->student_course_id})";
    }

    /**
     * Grava o período do aluno no semestre, criando ou atualizando o registro daquele semestre.
     *
     * @throws InvalidStudentCourse
     */
    public static function record(StudentCourse $studentCourse, Semester $semester, int $coursePeriod): self
    {
        if ($coursePeriod < 1 || $coursePeriod > Course::MAX_COURSE_PERIOD) {
            throw new InvalidStudentCourse('O período do curso deve estar entre 1 e '.Course::MAX_COURSE_PERIOD.'.');
        }

        $record = self::query()->firstOrNew([
            'student_course_id' => $studentCourse->getKey(),
            'semester_id' => $semester->getKey(),
        ]);
        $record->course_period = $coursePeriod;
        $record->save();

        return $record;
    }

    public function studentCourse(): BelongsTo
    {
        return $this->belongsTo(StudentCourse::class, 'student_course_id');
    }

    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class);
    }
}
