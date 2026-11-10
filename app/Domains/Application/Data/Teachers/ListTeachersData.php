<?php

declare(strict_types=1);

namespace App\Domains\Application\Data\Teachers;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\MergeValidationRules;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapInputName(SnakeCaseMapper::class)]
#[MergeValidationRules]
final class ListTeachersData extends Data
{
    public function __construct(
        public ?string $name = null,
        public ?string $email = null,
        public ?string $registration = null,
        public int $perPage = 10,
        public ?string $createdFrom = null,
        public ?string $createdTo = null,
        public ?string $courseName = null,
        public ?string $disciplineName = null,
    ) {}

    public static function rules(): array
    {
        return [
            'course_name' => ['nullable', 'string', 'max:255'],
            'discipline_name' => ['nullable', 'string', 'max:255'],
            'created_from' => ['nullable', 'date_format:Y-m-d'],
            'created_to' => ['nullable', 'date_format:Y-m-d'],
            'name' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'string', 'max:255'],
            'registration' => ['nullable', 'string', 'max:50'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}
