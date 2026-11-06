<?php

declare(strict_types=1);

namespace App\Domains\Infrastructure\Reporting\Inspections;

use App\Domains\Domain\Models\Inspections\InspectionEvidence;
use App\Domains\Application\Services\Reporting\ReportOptionCatalog;
use App\Domains\Domain\Enums\Reporting\ReportColumnType;
use App\Domains\Infrastructure\Sources\Reporting\EloquentReportSource;

final class InspectionEvidencesReportSource extends EloquentReportSource
{
    public function key(): string
    {
        return 'inclusive-radar.inspection-evidences';
    }

    public function label(): string
    {
        return 'Evidências de vistorias';
    }

    protected function model(): string
    {
        return InspectionEvidence::class;
    }

    protected function with(): array
    {
        return ['inspection.inspectable'];
    }

    protected function definitions(): array
    {
        return [
            'inspectable_type' => [
                'label' => 'Tipo do item',
                'path' => 'inspection.inspectable_type',
                'type' => ReportColumnType::SELECT,
                'options' => ReportOptionCatalog::inspectableTypes(),
            ],
            'inspectable' => ['label' => 'Item vistoriado', 'path' => 'inspection.inspectable.name'],
            'original_name' => ['label' => 'Nome do arquivo'], 'mime_type' => ['label' => 'Formato'],
            'size' => ['label' => 'Tamanho (bytes)'],
        ];
    }

    protected function filterable(): array
    {
        return ['inspectable_type', 'original_name', 'mime_type'];
    }

    protected function relationPolicy(string $parentModel, string $relationName): array
    {
        return ['include' => ['original_name', 'mime_type', 'size']];
    }
}
