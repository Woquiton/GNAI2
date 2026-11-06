<?php

declare(strict_types=1);

namespace App\Domains\Infrastructure\Reporting\Positions;

use App\Domains\Domain\Models\Positions\Position;
use App\Domains\Domain\Enums\Reporting\ReportColumnType;
use App\Domains\Infrastructure\Sources\Reporting\EloquentReportSource;

final class PositionsReportSource extends EloquentReportSource
{
    public function key(): string
    {
        return 'specialized-support.positions';
    }

    public function label(): string
    {
        return 'Cargos';
    }

    protected function model(): string
    {
        return Position::class;
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
