<?php

declare(strict_types=1);

namespace App\Domains\Application\Data\Teachers;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\MergeValidationRules;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapInputName(SnakeCaseMapper::class)]
#[MergeValidationRules]
final class UpdateTeacherDisciplinesData extends Data
{
    /**
     * @param array<int|string, list<int|string>> $assignments
     */
    public function __construct(
        public int $semesterId,
        public array $assignments = [],
    ) {}

    public static function rules(): array
    {
        return [
            'semester_id' => ['required', 'integer', 'exists:semesters,id'],
            'assignments' => ['nullable', 'array'],
        ];
    }

    public static function messages(): array
    {
        return [
            'semester_id.required' => 'Selecione o semestre dos vínculos.',
            'semester_id.integer' => 'O semestre selecionado é inválido.',
            'semester_id.exists' => 'O semestre selecionado é inválido.',
        ];
    }
}
