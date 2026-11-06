<?php

declare(strict_types=1);

namespace App\Domains\Infrastructure\Reporting\Semesters;

use App\Domains\Domain\Models\Peis\Pei;
use App\Domains\Domain\Enums\Reporting\ReportColumnType;
use App\Domains\Infrastructure\Sources\Reporting\EloquentReportSource;
use App\Domains\Domain\Models\Semesters\Semester;
use App\Domains\Domain\Models\StudentDocuments\StudentDocument;

final class SemestersReportSource extends EloquentReportSource
{
    public function key(): string
    {
        return 'specialized-support.semesters';
    }

    public function label(): string
    {
        return 'Semestres';
    }

    protected function model(): string
    {
        return Semester::class;
    }

    protected function definitions(): array
    {
        return [
            'label' => ['label' => 'Período'], 'year' => ['label' => 'Ano'], 'term' => ['label' => 'Número do semestre'],
            'start_date' => ['label' => 'Início', 'type' => ReportColumnType::DATE],
            'end_date' => ['label' => 'Fim', 'type' => ReportColumnType::DATE],
            'is_current' => ['label' => 'Atual', 'type' => ReportColumnType::BOOLEAN],
        ];
    }

    protected function filterable(): array
    {
        return ['label', 'year', 'is_current', 'start_date', 'end_date'];
    }

    protected function relationPolicy(string $parentModel, string $relationName): array
    {
        $excluded = in_array($parentModel, [StudentDocument::class, Pei::class], true)
            ? ['label', 'year', 'term']
            : [];

        return ['exclude' => $excluded];
    }
}
