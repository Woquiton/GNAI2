<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Infrastructure\Reporting;

use App\Domains\Inclusion\Domain\Models\Publication;
use App\Domains\Reporting\Domain\Enums\ReportColumnType;

final class PublicationsReportSource extends OperationReportSource
{
    public function key(): string
    {
        return 'inclusive-radar.publications';
    }

    public function label(): string
    {
        return 'Publicações';
    }

    protected function model(): string
    {
        return Publication::class;
    }

    protected function definitions(): array
    {
        return [
            'origin_semester' => $this->semesterDefinition(),
            'title' => ['label' => 'Título'], 'description' => ['label' => 'Descrição'],
            'start_date' => ['label' => 'Data inicial', 'type' => ReportColumnType::DATE],
            'end_date' => ['label' => 'Data final', 'type' => ReportColumnType::DATE],
            'start_time' => ['label' => 'Horário inicial'], 'end_time' => ['label' => 'Horário final'],
            'location' => ['label' => 'Local'], 'organizer' => ['label' => 'Organizador'],
            'audience' => ['label' => 'Público'], 'is_active' => ['label' => 'Ativo', 'type' => ReportColumnType::BOOLEAN],
        ];
    }

    protected function filterable(): array
    {
        return ['origin_semester', 'title', 'start_date', 'end_date', 'location', 'organizer', 'is_active'];
    }
}
