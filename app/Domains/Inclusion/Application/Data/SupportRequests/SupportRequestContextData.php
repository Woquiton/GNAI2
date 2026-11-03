<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Application\Data\SupportRequests;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapInputName(SnakeCaseMapper::class)]
final class SupportRequestContextData extends Data
{
    public function __construct(
        public ?int $studentId = null,
        public bool $fromStudent = false,
    ) {}

    public static function rules(): array
    {
        return [
            'from_student' => ['sometimes', 'boolean'],
            'student_id' => ['nullable', 'integer', 'exists:students,id'],
        ];
    }
}
