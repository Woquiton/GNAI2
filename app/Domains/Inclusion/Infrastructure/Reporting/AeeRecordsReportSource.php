<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Infrastructure\Reporting;

use App\Domains\Inclusion\Domain\Models\AeeRecord;
use App\Domains\Reporting\Domain\Enums\ReportColumnType;

final class AeeRecordsReportSource extends OperationReportSource
{
    public function key(): string
    {
        return 'specialized-support.aee-records';
    }

    public function label(): string
    {
        return 'Registros AEE';
    }

    protected function semesterPath(): string
    {
        return 'attendanceSession.semester_id';
    }

    protected function model(): string
    {
        return AeeRecord::class;
    }

    protected function with(): array
    {
        return ['attendanceSession.professional.person'];
    }

    protected function definitions(): array
    {
        return [
            'origin_semester' => $this->semesterDefinition(),
            'professional' => ['label' => 'Profissional', 'path' => 'attendanceSession.professional.person.name'],
            'session_date' => ['label' => 'Data do atendimento', 'path' => 'attendanceSession.session_date', 'type' => ReportColumnType::DATE],
            'duration' => ['label' => 'Duração'],
            'activities_performed' => ['label' => 'Atividades realizadas'],
            'strategies_used' => ['label' => 'Estratégias utilizadas'],
            'resources_used' => ['label' => 'Recursos utilizados'],
            'general_observations' => ['label' => 'Observações gerais'],
            'created_at' => ['label' => 'Criado em', 'type' => ReportColumnType::DATE],
        ];
    }

    protected function filterable(): array
    {
        return ['origin_semester', 'professional', 'session_date', 'duration', 'created_at'];
    }
}
