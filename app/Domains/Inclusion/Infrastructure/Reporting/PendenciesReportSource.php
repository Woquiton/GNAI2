<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Infrastructure\Reporting;

use App\Domains\Inclusion\Domain\Models\Pendency;
use App\Domains\Reporting\Domain\Enums\ReportColumnType;

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
