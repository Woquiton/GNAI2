<?php

declare(strict_types=1);

namespace App\Domains\Infrastructure\Reporting\Disciplines;

use App\Domains\Domain\Models\Disciplines\Discipline;
use App\Domains\Domain\Enums\Reporting\ReportColumnType;
use App\Domains\Infrastructure\Sources\Reporting\EloquentReportSource;

final class DisciplinesReportSource extends EloquentReportSource
{
    public function key(): string
    {
        return 'specialized-support.disciplines';
    }

    public function label(): string
    {
        return 'Disciplinas';
    }

    protected function model(): string
    {
        return Discipline::class;
    }

    protected function definitions(): array
    {
        return [
            'name' => ['label' => 'Nome'], 'description' => ['label' => 'Descrição'],
            'is_active' => ['label' => 'Ativa', 'type' => ReportColumnType::BOOLEAN],
        ];
    }

    protected function filterable(): array
    {
        return ['name', 'is_active'];
    }
}
