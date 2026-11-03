<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Infrastructure\Reporting;

use App\Domains\Inclusion\Domain\Enums\SupportRequestStatus;
use App\Domains\Inclusion\Domain\Models\SupportRequest;
use App\Domains\Reporting\Domain\Enums\ReportColumnType;

final class SupportRequestsReportSource extends OperationReportSource
{
    public function key(): string
    {
        return 'specialized-support.support-requests';
    }

    public function label(): string
    {
        return 'Solicitações de atendimento';
    }

    protected function model(): string
    {
        return SupportRequest::class;
    }

    protected function with(): array
    {
        return ['student.person', 'course'];
    }

    protected function definitions(): array
    {
        return [
            'origin_semester' => $this->semesterDefinition(),
            'student' => ['label' => 'Aluno', 'path' => 'student.person.name'],
            'course' => ['label' => 'Curso', 'path' => 'course.name'],
            'request_date' => ['label' => 'Solicitado em', 'type' => ReportColumnType::DATE],
            'status' => ['label' => 'Situação', 'type' => ReportColumnType::SELECT, 'options' => $this->enumOptions(SupportRequestStatus::class)],
            'analysis_notes' => ['label' => 'Análise inicial'],
            'referrals' => ['label' => 'Encaminhamentos'],
        ];
    }

    protected function filterable(): array
    {
        return ['origin_semester', 'student', 'course', 'request_date', 'status'];
    }
}
