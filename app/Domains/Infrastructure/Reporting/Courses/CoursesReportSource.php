<?php

declare(strict_types=1);

namespace App\Domains\Infrastructure\Reporting\Courses;

use App\Domains\Domain\Models\Courses\Course;
use App\Domains\Domain\Enums\Reporting\ReportColumnType;
use App\Domains\Infrastructure\Sources\Reporting\EloquentReportSource;

final class CoursesReportSource extends EloquentReportSource
{
    public function key(): string
    {
        return 'specialized-support.courses';
    }

    public function label(): string
    {
        return 'Cursos';
    }

    protected function model(): string
    {
        return Course::class;
    }

    protected function definitions(): array
    {
        return [
            'name' => ['label' => 'Nome'], 'description' => ['label' => 'Descrição'],
            'is_active' => ['label' => 'Ativo', 'type' => ReportColumnType::BOOLEAN],
        ];
    }

    protected function filterable(): array
    {
        return ['name', 'is_active'];
    }
}
