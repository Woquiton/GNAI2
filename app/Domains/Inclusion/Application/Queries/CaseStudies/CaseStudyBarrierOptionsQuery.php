<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Application\Queries\CaseStudies;

use App\Domains\Inclusion\Domain\Models\BarrierCategory;
use App\Domains\Inclusion\Domain\Models\CaseStudy;

final class CaseStudyBarrierOptionsQuery
{
    /** @return array<string, string> */
    public function execute(?CaseStudy $caseStudy = null): array
    {
        // O estudo guarda o nome como retrato histórico, no campo type existente.
        $options = BarrierCategory::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->pluck('name', 'name')
            ->all();

        // Categorias desativadas ou removidas continuam editáveis apenas nos
        // estudos em que já estavam registradas.
        foreach ($caseStudy?->barriers ?? [] as $barrier) {
            $value = (string) $barrier->type;
            $options[$value] ??= $value;
        }

        return $options;
    }
}
