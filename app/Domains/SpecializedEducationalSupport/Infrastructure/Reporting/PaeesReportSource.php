<?php

declare(strict_types=1);

namespace App\Domains\SpecializedEducationalSupport\Infrastructure\Reporting;

use App\Domains\Reporting\Domain\Enums\ReportColumnType;
use App\Domains\Reporting\Infrastructure\Sources\EloquentReportSource;
use App\Domains\SpecializedEducationalSupport\Domain\Models\Paee;

final class PaeesReportSource extends EloquentReportSource
{
    public function key(): string
    {
        return 'specialized-support.paees';
    }

    public function label(): string
    {
        return 'PAEEs';
    }

    protected function model(): string
    {
        return Paee::class;
    }

    protected function with(): array
    {
        return [
            'student.person',
            'creator.person',
            'semester',
            'caseStudy',
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
            'attendance_frequency_per_week' => ['label' => 'Frequência semanal'],
            'attendance_duration_minutes' => ['label' => 'Duração (min)'],
            'attendance_format' => ['label' => 'Formato do atendimento'],
            'attendance_location' => ['label' => 'Local do atendimento'],
            'next_review_date' => ['label' => 'Próxima revisão', 'type' => ReportColumnType::DATE],
            'created_at' => ['label' => 'Criado em', 'type' => ReportColumnType::DATE],
        ];
    }

    protected function filterable(): array
    {
        return ['status', 'semester', 'attendance_format', 'attendance_location', 'created_at'];
    }
}
