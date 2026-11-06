<?php

declare(strict_types=1);

namespace App\Domains\Application\Data\Paees;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapInputName(SnakeCaseMapper::class)]
final class AddPaeeReviewData extends Data
{
    public function __construct(
        public string $whatChanged,
        public string $why,
    ) {}

    public static function rules(): array
    {
        return [
            'what_changed' => ['required', 'string'],
            'why' => ['required', 'string'],
        ];
    }

    public static function attributes(): array
    {
        return [
            'what_changed' => 'o que mudou',
            'why' => 'por quê',
        ];
    }
}
