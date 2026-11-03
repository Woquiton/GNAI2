<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Application\Data\Courses;

use App\Domains\Inclusion\Domain\Models\Course;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\MergeValidationRules;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapInputName(SnakeCaseMapper::class)]
#[MergeValidationRules]
final class UpdateCourseData extends Data
{
    /**
     * @param list<int> $disciplineIds
     * @param array<int|string, int|string|null> $disciplinePeriods período do curso por id da disciplina
     */
    public function __construct(
        public string $name,
        public bool $isActive,
        public ?string $description = null,
        public array $disciplineIds = [],
        public array $disciplinePeriods = [],
    ) {}

    public static function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('courses', 'name')->ignore(request()->route('course'))],
            'description' => ['nullable', 'string'],
            'is_active' => ['required', 'boolean'],
            'discipline_ids' => ['nullable', 'array'],
            'discipline_ids.*' => ['integer', 'exists:disciplines,id'],
            'discipline_periods' => ['nullable', 'array'],
            'discipline_periods.*' => ['nullable', 'integer', 'between:1,'.Course::MAX_COURSE_PERIOD],
        ];
    }

    public static function messages(): array
    {
        return [
            'name.required' => 'O nome do curso é obrigatório.',
            'name.string' => 'O nome do curso deve ser um texto válido.',
            'name.max' => 'O nome do curso não pode ultrapassar 255 caracteres.',
            'name.unique' => 'Já existe um curso com esse nome.',
            'description.string' => 'A descrição do curso deve ser um texto válido.',
            'is_active.required' => 'Selecione a situação do curso.',
            'is_active.boolean' => 'O campo de situação do curso é inválido.',
            'discipline_ids.array' => 'As disciplinas do curso devem ser informadas em uma lista válida.',
            'discipline_ids.*.integer' => 'Uma das disciplinas selecionadas é inválida.',
            'discipline_ids.*.exists' => 'Uma das disciplinas selecionadas é inválida.',
            'discipline_periods.array' => 'Os períodos das disciplinas devem ser informados em uma lista válida.',
            'discipline_periods.*.integer' => 'Informe o período da disciplina como um número.',
            'discipline_periods.*.between' => 'O período da disciplina deve estar entre 1 e '.Course::MAX_COURSE_PERIOD.'.',
        ];
    }
}
