<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Application\Data\Waitlists;

use App\Domains\Inclusion\Domain\Enums\WaitlistStatus;
use App\Domains\Inclusion\Domain\Models\Semester;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\MergeValidationRules;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapInputName(SnakeCaseMapper::class)]
#[MergeValidationRules]
final class ListWaitlistsData extends Data
{
    public function __construct(
        public ?string $item = null,
        public ?string $student = null,
        public ?string $professional = null,
        public ?WaitlistStatus $status = null,
        public ?string $startDate = null,
        public ?string $endDate = null,
        public int $perPage = 10,
        public ?string $semesterId = null,
        public string $semesterMode = 'origin',
    ) {}

    public static function rules(): array
    {
        return [
            'item' => ['nullable', 'string', 'max:255'],
            'student' => ['nullable', 'string', 'max:255'],
            'professional' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', new Enum(WaitlistStatus::class)],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'semester_id' => ['nullable', 'string', Rule::in([...Semester::query()->pluck('id')->map(fn ($id) => (string) $id)->all(), 'unassigned'])],
            'semester_mode' => ['required_with:semester_id', Rule::in(['origin', 'started', 'active', 'ended'])],
            'per_page' => ['integer', 'min:1', 'max:100'],
        ];
    }
}
