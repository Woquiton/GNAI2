<?php

declare(strict_types=1);

namespace App\Domains\Application\Data\Teachers;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapInputName(SnakeCaseMapper::class)]
final class ListTeacherAssignmentsData extends Data
{
    public function __construct(
        public ?string $student = null,
        public ?string $discipline = null,
        public ?string $course = null,
        public int $perPage = 10,
    ) {}

    public static function rules(): array
    {
        return [
            'student' => ['nullable', 'string', 'max:255'],
            'discipline' => ['nullable', 'string', 'max:255'],
            'course' => ['nullable', 'string', 'max:255'],
            'per_page' => ['integer', 'min:1', 'max:100'],
        ];
    }
}
