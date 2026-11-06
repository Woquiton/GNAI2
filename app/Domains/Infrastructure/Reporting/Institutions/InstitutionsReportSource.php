<?php

declare(strict_types=1);

namespace App\Domains\Infrastructure\Reporting\Institutions;

use App\Domains\Domain\Models\Institutions\Institution;
use App\Domains\Domain\Enums\Reporting\ReportColumnType;
use App\Domains\Infrastructure\Sources\Reporting\EloquentReportSource;

final class InstitutionsReportSource extends EloquentReportSource
{
    public function key(): string
    {
        return 'inclusive-radar.institutions';
    }

    public function label(): string
    {
        return 'Instituições';
    }

    protected function model(): string
    {
        return Institution::class;
    }

    protected function definitions(): array
    {
        return [
            'name' => ['label' => 'Nome'], 'short_name' => ['label' => 'Sigla'],
            'city' => ['label' => 'Cidade'], 'state' => ['label' => 'Estado'], 'district' => ['label' => 'Bairro'],
            'address' => ['label' => 'Endereço'], 'latitude' => ['label' => 'Latitude'], 'longitude' => ['label' => 'Longitude'],
            'is_active' => ['label' => 'Ativa', 'type' => ReportColumnType::BOOLEAN],
        ];
    }

    protected function filterable(): array
    {
        return ['name', 'short_name', 'city', 'state', 'is_active'];
    }
}
