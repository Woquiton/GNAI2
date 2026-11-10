<?php

declare(strict_types=1);

namespace App\Domains\Application\Data\SupportRequests;

use App\Domains\Domain\Enums\SupportRequests\SupportRequestStatus;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapInputName(SnakeCaseMapper::class)]
final class ListSupportRequestsData extends Data
{
    public function __construct(
        public ?string $search = null,
        public ?string $status = null,
        public ?int $studentId = null,
        public int $perPage = 10,
        public ?string $createdFrom = null,
        public ?string $createdTo = null,
    ) {}

    public static function rules(): array
    {
        return [
            'created_from' => ['nullable', 'date_format:Y-m-d'],
            'created_to' => ['nullable', 'date_format:Y-m-d'],
            'search' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', Rule::enum(SupportRequestStatus::class)],
            'student_id' => ['nullable', 'integer', 'exists:students,id'],
            'per_page' => ['sometimes', 'integer', 'in:10,25,50,100'],
        ];
    }
}
