<?php

declare(strict_types=1);

namespace App\Infrastructure\Reporting;

use App\Domain\Enums\BarrierStatus;
use App\Domain\Enums\ConservationState;
use App\Domain\Enums\InspectionType;
use App\Domain\Models\Barrier;
use App\Domain\Models\Inspection;
use App\Domain\Models\Item;
use App\Domains\Reporting\Application\Services\ReportOptionCatalog;
use App\Domains\Reporting\Domain\DTOs\PolymorphicReportRelationDTO;
use App\Domains\Reporting\Domain\Enums\ReportColumnType;

final class InspectionsReportSource extends OperationReportSource
{
    public function key(): string
    {
        return 'inclusive-radar.inspections';
    }

    public function label(): string
    {
        return 'Vistorias';
    }

    protected function model(): string
    {
        return Inspection::class;
    }

    protected function with(): array
    {
        return ['inspectable', 'registeredBy'];
    }

    public function polymorphicRelations(): array
    {
        return [
            new PolymorphicReportRelationDTO(
                key: 'item',
                label: 'Item',
                eloquentRelation: 'inspectable',
                morphType: 'item',
                sourceKey: 'inclusive-radar.items',
            ),
            new PolymorphicReportRelationDTO(
                key: 'barrier',
                label: 'Barreira',
                eloquentRelation: 'inspectable',
                morphType: 'barrier',
                sourceKey: 'inclusive-radar.barriers',
            ),
        ];
    }

    protected function definitions(): array
    {
        return [
            'origin_semester' => $this->semesterDefinition(),
            'inspectable_type' => [
                'label' => 'Tipo do item vistoriado',
                'type' => ReportColumnType::SELECT,
                'options' => ReportOptionCatalog::inspectableTypes(),
            ],
            'inspectable' => ['label' => 'Item vistoriado', 'path' => 'inspectable.name'],
            'state' => ['label' => 'Estado de conservação', 'type' => ReportColumnType::SELECT, 'options' => $this->enumOptions(ConservationState::class)],
            'status' => ['label' => 'Situação', 'type' => ReportColumnType::SELECT, 'options' => $this->enumOptions(BarrierStatus::class)],
            'type' => ['label' => 'Tipo de vistoria', 'type' => ReportColumnType::SELECT, 'options' => $this->enumOptions(InspectionType::class)],
            'inspection_date' => ['label' => 'Data', 'type' => ReportColumnType::DATE],
            'description' => ['label' => 'Descrição'],
            'registered_by' => ['label' => 'Registrada por', 'path' => 'registeredBy.name'],
        ];
    }

    protected function filterable(): array
    {
        return ['origin_semester', 'inspectable_type', 'state', 'status', 'type', 'inspection_date', 'registered_by'];
    }

    protected function relationPolicy(string $parentModel, string $relationName): array
    {
        $excluded = in_array($parentModel, [
            Item::class,
            Barrier::class,
        ], true) ? ['inspectable_type', 'inspectable'] : [];

        return ['exclude' => $excluded];
    }
}
