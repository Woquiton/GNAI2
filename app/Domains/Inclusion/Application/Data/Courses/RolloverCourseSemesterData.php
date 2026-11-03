<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Application\Data\Courses;

use App\Domains\Inclusion\Domain\Models\Course;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * Virada de semestre de um curso. Cada linha informa a matrícula, a ação (`advance`: avança um período,
 * `retain`: permanece no mesmo, `skip`: não registra) e, quando o aluno não tem período anterior, o
 * período no semestre de destino.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class RolloverCourseSemesterData extends Data
{
    /**
     * @param  list<array{student_course_id: int|string, action: string, course_period?: int|string|null}>  $rows
     */
    public function __construct(
        public int $semesterId,
        public array $rows = [],
    ) {}

    public static function rules(): array
    {
        return [
            'semester_id' => ['required', 'integer', 'exists:semesters,id'],
            'rows' => ['required', 'array'],
            'rows.*.student_course_id' => ['required', 'integer', 'distinct', 'exists:student_courses,id'],
            'rows.*.action' => ['required', Rule::in(['advance', 'retain', 'skip'])],
            'rows.*.course_period' => ['nullable', 'integer', 'between:1,'.Course::MAX_COURSE_PERIOD],
        ];
    }

    public static function messages(): array
    {
        return [
            'semester_id.required' => 'Selecione o semestre de destino.',
            'semester_id.integer' => 'O semestre selecionado é inválido.',
            'semester_id.exists' => 'O semestre selecionado é inválido.',
            'rows.required' => 'Não há alunos para registrar no semestre.',
            'rows.*.student_course_id.*' => 'Uma das matrículas informadas é inválida.',
            'rows.*.action.*' => 'Escolha a situação do aluno no semestre.',
            'rows.*.course_period.integer' => 'Informe o período do curso como um número.',
            'rows.*.course_period.between' => 'O período do curso deve estar entre 1 e '.Course::MAX_COURSE_PERIOD.'.',
        ];
    }
}
