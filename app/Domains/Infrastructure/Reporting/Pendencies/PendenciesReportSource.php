<?php

declare(strict_types=1);

namespace App\Domains\Infrastructure\Reporting\Pendencies;

use App\Domains\Domain\Models\Pendencies\Pendency;
use App\Domains\Domain\Enums\Reporting\ReportColumnType;
use App\Domains\Infrastructure\Reporting\Reporting\OperationReportSource;

final class PendenciesReportSource extends OperationReportSource
{
    public function key(): string
    {
        return 'specialized-support.pendencies';
    }

    public function label(): string
    {
        return 'Pendências';
    }

    protected function model(): string
    {
        return Pendency::class;
    }

    protected function with(): array
    {
        return ['creator', 'assignedProfessional.person'];
    }

    protected function definitions(): array
    {
        return [
            'completed_at' => ['label' => 'Concluída em', 'type' => ReportColumnType::DATE],
            'origin_semester' => $this->semesterDefinition(),
            'title' => ['label' => 'Título'], 'description' => ['label' => 'Descrição'],
            'priority' => ['label' => 'Prioridade'],
            'due_date' => ['label' => 'Prazo', 'type' => ReportColumnType::DATE],
            'is_completed' => ['label' => 'Concluída', 'type' => ReportColumnType::BOOLEAN],
            'creator' => ['label' => 'Criada por', 'path' => 'creator.name'],
            'assigned_professional' => ['label' => 'Responsável', 'path' => 'assignedProfessional.person.name'],
            'created_at' => ['label' => 'Criada em', 'type' => ReportColumnType::DATE],
        ];
    }

    protected function filterable(): array
    {
        return ['completed_at', 'origin_semester', 'title', 'priority', 'due_date', 'is_completed', 'creator', 'assigned_professional'];
    }
}
