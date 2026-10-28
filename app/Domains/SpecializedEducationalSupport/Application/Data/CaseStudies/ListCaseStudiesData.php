<?php

declare(strict_types=1);

namespace App\Domains\SpecializedEducationalSupport\Application\Data\CaseStudies;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapInputName(SnakeCaseMapper::class)]
final class ListCaseStudiesData extends Data
{
    public function __construct(
        public ?string $status = null,
        public ?int $semesterId = null,
        public ?string $search = null,
    ) {}
}
