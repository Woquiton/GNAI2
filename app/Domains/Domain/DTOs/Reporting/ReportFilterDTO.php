<?php

declare(strict_types=1);

namespace App\Domains\Domain\DTOs\Reporting;

use App\Domains\Domain\Enums\Reporting\ReportOperator;

final readonly class ReportFilterDTO
{
    public function __construct(
        public string $field,
        public ReportOperator $operator,
        public string|int|float|bool $value,
    ) {}
}
