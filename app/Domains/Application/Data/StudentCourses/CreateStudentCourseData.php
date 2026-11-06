<?php

declare(strict_types=1);

namespace App\Domains\Application\Data\StudentCourses;

use App\Domains\Domain\Models\Courses\Course;
use App\Domains\Domain\Models\Students\Student;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapInputName(SnakeCaseMapper::class)]
final class CreateStudentCourseData extends Data
{
    public function __construct(
        public int $courseId,
        public int $academicYear,
        public ?int $semesterId = null,
        public bool $isCurrent = false,
        public ?string $schoolAttendanceStatus = null,
        public array $failedDisciplineIds = [],
        public array $atRiskDisciplineIds = [],
        public ?int $coursePeriod = null,
    ) {}

    public static function rules(): array
    {
        $student = request()->route('student');
        $studentId = $student instanceof Student ? (int) $student->getKey() : $student;

        return [
            'course_id' => [
                'required',
                'integer',
                Rule::exists('courses', 'id'),
                Rule::unique('student_courses', 'course_id')
                    ->where('student_id', $studentId),
            ],
            'academic_year' => ['required', 'digits:4'],
            'semester_id' => ['nullable', 'required_with:course_period,failed_discipline_ids,at_risk_discipline_ids', 'integer', Rule::exists('semesters', 'id')],
            'course_period' => ['nullable', 'integer', 'between:1,'.Course::MAX_COURSE_PERIOD],
            'is_current' => ['sometimes', 'boolean'],
            'school_attendance_status' => ['nullable', 'string', 'max:100000'],
            'failed_discipline_ids' => ['nullable', 'array'],
            'failed_discipline_ids.*' => ['integer', 'distinct', 'exists:disciplines,id'],
            'at_risk_discipline_ids' => ['nullable', 'array'],
            'at_risk_discipline_ids.*' => ['integer', 'distinct', 'exists:disciplines,id'],
        ];
    }

    public static function messages(): array
    {
        return [
            'course_id.required' => 'O curso é obrigatório.',
            'course_id.integer' => 'O curso selecionado é inválido.',
            'course_id.exists' => 'O curso selecionado é inválido.',
            'course_id.unique' => 'Este aluno já possui vínculo com o curso selecionado.',
            'academic_year.required' => 'O ano letivo é obrigatório.',
            'academic_year.digits' => 'O ano letivo deve conter 4 dígitos.',
            'semester_id.required_with' => 'Informe o semestre do período do curso, das reprovações e dos riscos de insucesso.',
            'course_period.integer' => 'Informe o período do curso como um número.',
            'course_period.between' => 'O período do curso deve estar entre 1 e '.Course::MAX_COURSE_PERIOD.'.',
            'is_current.boolean' => 'O campo de matrícula atual é inválido.',
        ];
    }
}
