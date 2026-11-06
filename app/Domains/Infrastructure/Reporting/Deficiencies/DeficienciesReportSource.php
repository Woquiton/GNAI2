<?php

declare(strict_types=1);

namespace App\Domains\Infrastructure\Reporting\Deficiencies;

use App\Domains\Domain\Models\Deficiencies\Deficiency;
use App\Domains\Domain\Enums\Reporting\ReportColumnType;
use App\Domains\Infrastructure\Sources\Reporting\EloquentReportSource;

final class DeficienciesReportSource extends EloquentReportSource
{
    public function key(): string
    {
        return 'specialized-support.deficiencies';
    }

    public function label(): string
    {
        return 'Deficiências';
    }

    protected function model(): string
    {
        return Deficiency::class;
    }

    protected function definitions(): array
    {
        return [
            'name' => ['label' => 'Nome'], 'cid_code' => ['label' => 'Código CID'],
            'description' => ['label' => 'Descrição'],
            'is_active' => ['label' => 'Ativa', 'type' => ReportColumnType::BOOLEAN],
        ];
    }

    protected function filterable(): array
    {
        return ['name', 'cid_code', 'is_active'];
    }
}
