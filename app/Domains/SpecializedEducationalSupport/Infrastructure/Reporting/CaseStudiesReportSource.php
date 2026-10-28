<?php

declare(strict_types=1);

namespace App\Domains\SpecializedEducationalSupport\Infrastructure\Reporting;

use App\Domains\Reporting\Domain\Enums\ReportColumnType;
use App\Domains\Reporting\Infrastructure\Sources\EloquentReportSource;
use App\Domains\SpecializedEducationalSupport\Domain\Models\CaseStudy;

final class CaseStudiesReportSource extends EloquentReportSource
{
    public function key(): string
    {
        return 'specialized-support.case-studies';
    }

    public function label(): string
    {
        return 'Estudos de Caso';
    }

    protected function model(): string
    {
        return CaseStudy::class;
    }

    protected function with(): array
    {
        return [
            'student.person',
            'creator.person',
            'semester',
        ];
    }

    public function excludedRelations(): array
    {
        return [];
    }

    protected function definitions(): array
    {
        return [
            'student' => ['label' => 'Estudante', 'path' => 'student.person.name'],
            'creator' => ['label' => 'Criador', 'path' => 'creator.name'],
            'semester' => ['label' => 'Semestre', 'path' => 'semester.name'],
            'version' => ['label' => 'Versão'],
            'status' => ['label' => 'Status'],
            'demand_origin' => ['label' => 'Origem da demanda'],
            'favorable_aspects' => ['label' => 'Aspectos favoráveis'],
            'potentials_interests' => ['label' => 'Potenciais e interesses'],
            'acceptance_status' => ['label' => 'Status de aceite'],
            'completed_at' => ['label' => 'Concluído em', 'type' => ReportColumnType::DATE],
            'created_at' => ['label' => 'Criado em', 'type' => ReportColumnType::DATE],
        ];
    }

    protected function filterable(): array
    {
        return ['status', 'semester', 'demand_origin', 'acceptance_status', 'created_at'];
    }
}
