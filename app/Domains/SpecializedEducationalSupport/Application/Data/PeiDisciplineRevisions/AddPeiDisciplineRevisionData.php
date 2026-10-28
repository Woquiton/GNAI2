<?php

declare(strict_types=1);

namespace App\Domains\SpecializedEducationalSupport\Application\Data\PeiDisciplineRevisions;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapInputName(SnakeCaseMapper::class)]
final class AddPeiDisciplineRevisionData extends Data
{
    public function __construct(
        public string $whatChanged,
        public string $why,
    ) {}

    public static function rules(): array
    {
        return [
            'what_changed' => ['required', 'string', 'max:100000'],
            'why' => ['required', 'string', 'max:100000'],
        ];
    }
}
