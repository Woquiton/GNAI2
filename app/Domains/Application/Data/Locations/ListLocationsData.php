<?php

declare(strict_types=1);

namespace App\Domains\Application\Data\Locations;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapInputName(SnakeCaseMapper::class)]
final class ListLocationsData extends Data
{
    public function __construct(
        public ?string $name = null,
        public ?string $institutionName = null,
        public ?bool $isActive = null,
        public int $perPage = 10,
        public ?string $createdFrom = null,
        public ?string $createdTo = null,
        public ?string $type = null,
        public ?bool $hasBarriers = null,
    ) {}

    public static function rules(): array
    {
        return [
            'type' => ['nullable', 'string', 'max:255'],
            'has_barriers' => ['nullable', 'boolean'],
            'created_from' => ['nullable', 'date_format:Y-m-d'],
            'created_to' => ['nullable', 'date_format:Y-m-d'],
            'name' => ['nullable', 'string', 'max:255'],
            'institution_name' => ['nullable', 'string', 'max:255'],
            'is_active' => ['nullable', 'boolean'],
            'per_page' => ['integer', 'min:1', 'max:100'],
        ];
    }
}
