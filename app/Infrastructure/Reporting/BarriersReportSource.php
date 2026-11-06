<?php

declare(strict_types=1);

namespace App\Infrastructure\Reporting;

use App\Domain\Models\Barrier;
use App\Domains\Reporting\Domain\Enums\ReportColumnType;

final class BarriersReportSource extends OperationReportSource
{
    public function key(): string
    {
        return 'inclusive-radar.barriers';
    }

    public function label(): string
    {
        return 'Barreiras';
    }

    protected function model(): string
    {
        return Barrier::class;
    }

    protected function with(): array
    {
        return ['registeredBy', 'institution', 'category', 'location', 'affectedStudent.person', 'affectedProfessional.person'];
    }

    protected function definitions(): array
    {
        return [
            'origin_semester' => $this->semesterDefinition(),
            'name' => ['label' => 'Nome'], 'description' => ['label' => 'Descrição'],
            'institution' => ['label' => 'Instituição', 'path' => 'institution.name'],
            'category' => ['label' => 'Categoria', 'path' => 'category.name'],
            'location' => ['label' => 'Local', 'path' => 'location.name'],
            'affected_student' => ['label' => 'Aluno afetado', 'path' => 'affectedStudent.person.name'],
            'affected_professional' => ['label' => 'Profissional afetado', 'path' => 'affectedProfessional.person.name'],
            'affected_person_name' => ['label' => 'Outra pessoa afetada'],
            'affected_person_role' => ['label' => 'Papel da pessoa afetada'],
            'is_anonymous' => ['label' => 'Registro anônimo', 'type' => ReportColumnType::BOOLEAN],
            'priority' => ['label' => 'Prioridade'],
            'identified_at' => ['label' => 'Identificada em', 'type' => ReportColumnType::DATE],
            'resolved_at' => ['label' => 'Resolvida em', 'type' => ReportColumnType::DATE],
            'registered_by' => ['label' => 'Registrada por', 'path' => 'registeredBy.name'],
            'is_active' => ['label' => 'Ativa', 'type' => ReportColumnType::BOOLEAN],
        ];
    }

    protected function filterable(): array
    {
        return ['origin_semester', 'name', 'institution', 'category', 'location', 'affected_student', 'affected_professional', 'priority', 'identified_at', 'resolved_at', 'registered_by', 'is_active'];
    }
}
