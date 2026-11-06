<?php

declare(strict_types=1);

namespace App\Infrastructure\Reporting;

use App\Domain\Enums\TagModule;
use App\Domain\Models\Tag;
use App\Domains\Reporting\Domain\Enums\ReportColumnType;
use App\Domains\Reporting\Infrastructure\Sources\EloquentReportSource;

final class TagsReportSource extends EloquentReportSource
{
    public function key(): string
    {
        return 'inclusive-radar.tags';
    }

    public function label(): string
    {
        return 'Etiquetas';
    }

    protected function model(): string
    {
        return Tag::class;
    }

    protected function definitions(): array
    {
        return [
            'name' => ['label' => 'Nome'],
            'module' => ['label' => 'Módulo', 'type' => ReportColumnType::SELECT, 'options' => TagModule::options()],
            'color' => ['label' => 'Cor'],
            'is_active' => ['label' => 'Ativo', 'type' => ReportColumnType::BOOLEAN],
        ];
    }

    protected function filterable(): array
    {
        return ['name', 'module', 'is_active'];
    }
}
