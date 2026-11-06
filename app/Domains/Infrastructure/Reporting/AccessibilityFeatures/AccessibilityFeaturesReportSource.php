<?php

declare(strict_types=1);

namespace App\Domains\Infrastructure\Reporting\AccessibilityFeatures;

use App\Domains\Domain\Models\AccessibilityFeatures\AccessibilityFeature;
use App\Domains\Domain\Enums\Reporting\ReportColumnType;
use App\Domains\Infrastructure\Sources\Reporting\EloquentReportSource;

final class AccessibilityFeaturesReportSource extends EloquentReportSource
{
    public function key(): string
    {
        return 'inclusive-radar.accessibility-features';
    }

    public function label(): string
    {
        return 'Recursos de acessibilidade';
    }

    protected function model(): string
    {
        return AccessibilityFeature::class;
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
