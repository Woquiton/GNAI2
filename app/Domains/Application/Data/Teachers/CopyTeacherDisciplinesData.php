<?php

declare(strict_types=1);

namespace App\Domains\Application\Data\Teachers;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/** Semestre que recebe a cópia dos vínculos do semestre anterior. */
#[MapInputName(SnakeCaseMapper::class)]
final class CopyTeacherDisciplinesData extends Data
{
    public function __construct(
        public int $semesterId,
    ) {}

    public static function rules(): array
    {
        return [
            'semester_id' => ['required', 'integer', 'exists:semesters,id'],
        ];
    }

    public static function messages(): array
    {
        return [
            'semester_id.required' => 'Selecione o semestre que vai receber os vínculos.',
            'semester_id.integer' => 'O semestre selecionado é inválido.',
            'semester_id.exists' => 'O semestre selecionado é inválido.',
        ];
    }
}
