<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Infrastructure\Reporting;

use App\Domains\Inclusion\Domain\Models\OperationStatusChange;
use App\Domains\Reporting\Domain\Enums\ReportColumnType;
use App\Domains\Reporting\Domain\Enums\ReportSourceVisibility;

final class OperationStatusChangesReportSource extends OperationReportSource
{
    public function key(): string
    {
        return 'inclusion.operation-status-changes';
    }

    public function label(): string
    {
        return 'Histórico de movimentações';
    }

    public function visibility(): ReportSourceVisibility
    {
        return ReportSourceVisibility::RELATION_ONLY;
    }

    protected function model(): string
    {
        return OperationStatusChange::class;
    }

    protected function with(): array
    {
        return ['semester', 'actor'];
    }

    protected function definitions(): array
    {
        return [
            'origin_semester' => [...$this->semesterDefinition(), 'label' => 'Semestre da movimentação'],
            'field' => ['label' => 'Campo alterado', 'type' => ReportColumnType::SELECT, 'options' => [
                'status' => 'Situação',
                'is_completed' => 'Conclusão da pendência',
                'resolved_at' => 'Resolução da barreira',
            ]],
            'from_value' => ['label' => 'Valor anterior'],
            'to_value' => ['label' => 'Novo valor'],
            'occurred_at' => ['label' => 'Ocorrido em', 'type' => ReportColumnType::DATE],
            'recorded_at' => ['label' => 'Registrado em', 'type' => ReportColumnType::DATE],
            'actor' => ['label' => 'Responsável', 'path' => 'actor.name'],
        ];
    }

    protected function filterable(): array
    {
        return ['origin_semester', 'field', 'from_value', 'to_value', 'occurred_at', 'recorded_at', 'actor'];
    }
}
