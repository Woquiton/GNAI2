<?php

declare(strict_types=1);

namespace App\Domains\Application\Data\Publications;

use App\Domains\Domain\Enums\Publications\PublicationType;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapInputName(SnakeCaseMapper::class)]
final class ListPublicationsData extends Data
{
    public function __construct(
        public ?string $title = null,
        public ?bool $isActive = null,
        public ?string $type = null,
        public int $perPage = 10,
        public ?string $createdFrom = null,
        public ?string $createdTo = null,
        public ?string $authorName = null,
        public ?string $tagName = null,
        public ?bool $isFeatured = null,
    ) {}

    public static function rules(): array
    {
        return [
            'author_name' => ['nullable', 'string', 'max:255'],
            'tag_name' => ['nullable', 'string', 'max:255'],
            'is_featured' => ['nullable', 'boolean'],
            'created_from' => ['nullable', 'date_format:Y-m-d'],
            'created_to' => ['nullable', 'date_format:Y-m-d'],
            'title' => ['nullable', 'string', 'max:255'],
            'is_active' => ['nullable', 'boolean'],
            'type' => ['nullable', Rule::enum(PublicationType::class)],
            'per_page' => ['integer', 'min:1', 'max:100'],
        ];
    }
}
