<?php

declare(strict_types=1);

namespace App\Domains\Application\Data\Auth\Sessions;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapInputName(SnakeCaseMapper::class)]
final class SessionActivityData extends Data
{
    public function __construct(public ?string $returnTo = null) {}

    public static function rules(): array
    {
        return ['return_to' => ['nullable', 'string', 'max:2048']];
    }
}
