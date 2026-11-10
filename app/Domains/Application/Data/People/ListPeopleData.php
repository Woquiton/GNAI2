<?php

declare(strict_types=1);

namespace App\Domains\Application\Data\People;

use Illuminate\Validation\Rule;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapInputName(SnakeCaseMapper::class)]
final class ListPeopleData extends Data
{
    public function __construct(
        public ?string $name = null,
        public ?int $tagId = null,
        public ?string $createdFrom = null,
        public ?string $createdTo = null,
        public ?string $email = null,
        public ?string $phone = null,
    ) {}

    public static function rules(): array
    {
        return [
            'email' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'created_from' => ['nullable', 'date_format:Y-m-d'],
            'created_to' => ['nullable', 'date_format:Y-m-d'],
            'name' => ['nullable', 'string', 'max:255'],
            'tag_id' => ['nullable', 'integer', Rule::exists('tags', 'id')->where('module', 'people')],
        ];
    }
}
