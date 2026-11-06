<?php

declare(strict_types=1);

namespace App\Domains\UI\Controllers\Audit;

use App\Domains\Application\Data\Audit\ListAuditRecordsData;
use App\Domains\Application\Queries\Audit\AuditFilterOptionsQuery;
use App\Domains\Application\Queries\Audit\ListAuditRecordsQuery;
use App\Domains\Domain\Models\Audit\AuditRecord;
use App\Domains\UI\Presenters\Audit\AuditRecordPresenter;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

final class AuditController
{
    public function index(
        ListAuditRecordsData $filters,
        ListAuditRecordsQuery $records,
        AuditFilterOptionsQuery $options,
        AuditRecordPresenter $presenter,
    ): InertiaResponse {
        return Inertia::render('Audit/Index', [
            'records' => $records
                ->execute($filters)
                ->through(fn (AuditRecord $record): array => $presenter->present($record)),
            'filters' => $filters->toFilters(),
            'options' => $options->execute(),
        ]);
    }
}
