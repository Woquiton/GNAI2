<?php

declare(strict_types=1);

namespace App\Domains\UI\Controllers\Reporting;

use App\Domains\Application\Actions\Reporting\ExportReportPdfAction;
use App\Domains\Application\Actions\Reporting\RunReportAction;
use App\Domains\Application\Data\Reporting\RunReportData;
use App\Domains\Application\Queries\Reporting\GetReportMetadataQuery;
use App\Domains\Application\Queries\Reporting\ListReportSourcesQuery;
use App\Domains\Domain\Exceptions\Reporting\ReportingException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Symfony\Component\HttpFoundation\Response;

final class ReportController
{
    public function index(Request $request): InertiaResponse
    {
        return Inertia::render('Reports/Builder', [
            'can' => [
                'sources' => $request->user()?->can('report.available') ?? false,
                'metadata' => $request->user()?->can('report.meta') ?? false,
                'configureRelations' => $request->user()?->can('report.builder') ?? false,
                'run' => $request->user()?->can('report.run') ?? false,
                'pdf' => $request->user()?->can('report.pdf') ?? false,
            ],
        ]);
    }

    public function sources(ListReportSourcesQuery $query): JsonResponse
    {
        return response()->json($query->execute());
    }

    public function metadata(Request $request, GetReportMetadataQuery $query): JsonResponse
    {
        $validated = $request->validate([
            'source' => ['required', 'string', 'regex:/^[a-z0-9.-]+$/', 'max:100'],
        ]);

        return response()->json($query->execute($validated['source']));
    }

    /**
     * @throws ReportingException
     */
    public function run(RunReportData $data, RunReportAction $action): JsonResponse
    {
        $result = $action->execute($data);

        return response()->json($result->toArray());
    }

    /**
     * @throws ReportingException
     */
    public function exportPdf(RunReportData $data, ExportReportPdfAction $action): Response
    {
        return $action->execute($data);
    }
}
