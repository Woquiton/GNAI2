<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Reporting;

use App\Domains\Application\Contracts\Reporting\ReportSource;
use App\Domains\Application\Services\Reporting\ReportCatalog;
use App\Domains\Domain\Enums\Reporting\ReportSourceVisibility;

final readonly class ListReportSourcesQuery
{
    public function __construct(private ReportCatalog $catalog) {}

    /** @return list<array{key: string, label: string}> */
    public function execute(): array
    {
        return $this->catalog->all()
            ->filter(static fn (ReportSource $source): bool => $source->visibility() === ReportSourceVisibility::PRIMARY)
            ->values()
            ->map(fn (ReportSource $source): array => [
                'key' => $source->key(),
                'label' => $source->label(),
            ])
            ->all();
    }
}
