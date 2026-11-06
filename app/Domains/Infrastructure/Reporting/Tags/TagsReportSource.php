<?php

declare(strict_types=1);

namespace App\Domains\Infrastructure\Reporting\Tags;

use App\Domains\Domain\Enums\Reporting\ReportColumnType;
use App\Domains\Infrastructure\Sources\Reporting\EloquentReportSource;
use App\Domains\Domain\Enums\Tags\TagModule;
use App\Domains\Domain\Models\Tags\Tag;

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
