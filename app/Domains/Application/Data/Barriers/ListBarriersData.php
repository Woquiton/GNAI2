<?php

declare(strict_types=1);

namespace App\Domains\Application\Data\Barriers;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapInputName(SnakeCaseMapper::class)]
final class ListBarriersData extends Data
{
    public function __construct(
        public ?string $name = null,
        public ?string $category = null,
        public ?string $priority = null,
        public ?string $status = null,
        public int $perPage = 10,
        public ?string $createdFrom = null,
        public ?string $createdTo = null,
        public ?string $institutionName = null,
        public ?string $locationName = null,
        public ?bool $isActive = null,
    ) {}

    public static function rules(): array
    {
        return [
            'institution_name' => ['nullable', 'string', 'max:255'],
            'location_name' => ['nullable', 'string', 'max:255'],
            'is_active' => ['nullable', 'boolean'],
            'created_from' => ['nullable', 'date_format:Y-m-d'],
            'created_to' => ['nullable', 'date_format:Y-m-d'],
            'per_page' => ['integer', 'min:1', 'max:100'],
        ];
    }
}
