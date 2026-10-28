<?php

declare(strict_types=1);

namespace App\Domains\SpecializedEducationalSupport\Application\Data\PeiDisciplines;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapInputName(SnakeCaseMapper::class)]
final class BulkAssignPeiDisciplinesData extends Data
{
    /**
     * @param array<int, array{discipline_id: int, teacher_id: int}> $assignments
     */
    public function __construct(
        public array $assignments,
    ) {}

    public static function rules(): array
    {
        return [
            'assignments' => ['required', 'array', 'min:1'],
            'assignments.*.discipline_id' => ['required', 'integer', 'exists:disciplines,id'],
            'assignments.*.teacher_id' => ['required', 'integer', 'exists:teachers,id'],
        ];
    }

    public static function messages(): array
    {
        return [
            'assignments.required' => 'Selecione ao menos um professor para alguma disciplina.',
            'assignments.min' => 'Selecione ao menos um professor para alguma disciplina.',
        ];
    }
}
