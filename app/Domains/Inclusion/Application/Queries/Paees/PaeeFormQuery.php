<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Application\Queries\Paees;

use App\Domains\Inclusion\Domain\Enums\ItemType;
use App\Domains\Inclusion\Domain\Enums\StudentDocumentType;
use App\Domains\Inclusion\Domain\Exceptions\InvalidPaee;
use App\Domains\Inclusion\Domain\Models\CaseStudy;
use App\Domains\Inclusion\Domain\Models\Item;
use App\Domains\Inclusion\Domain\Models\Paee;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

final class PaeeFormQuery
{
    public function forCreation(CaseStudy $caseStudy): array
    {
        $caseStudy->load(['student.person', 'barriers']);
        $caseStudy->student->ensureNotInIntake();

        $hasLaudo = $caseStudy->student->documents()
            ->where('type', StudentDocumentType::TECHNICAL_REPORT->value)
            ->exists();

        if ($caseStudy->status !== CaseStudy::STATUS_COMPLETED && ! $hasLaudo) {
            throw new InvalidPaee('O PAEE só pode ser criado a partir de um Estudo de Caso concluído ou de um Laudo anexado ao aluno.');
        }

        $assistiveTechnologies = $this->assistiveTechnologies();

        return compact('caseStudy', 'assistiveTechnologies');
    }

    public function forUpdate(Paee $paee): array
    {
        $paee->load(['student.person', 'caseStudy.barriers', 'objectives', 'resources']);
        $paee->student->ensureNotInIntake();

        $assistiveTechnologies = $this->assistiveTechnologies(
            $paee->resources->pluck('assistive_technology_id')->filter()->map(static fn ($id): int => (int) $id)->all(),
        );

        return compact('paee', 'assistiveTechnologies');
    }

    /**
     * Tecnologias assistivas ativas do catálogo de itens, mais as já vinculadas ao PAEE,
     * para que a edição não perca um vínculo com item desativado ou removido.
     *
     * @param  list<int>  $linkedIds
     * @return Collection<int, Item>
     */
    private function assistiveTechnologies(array $linkedIds = []): Collection
    {
        return Item::withTrashed()
            ->where('item_type', ItemType::AssistiveTechnology->value)
            ->where(static function (Builder $query) use ($linkedIds): void {
                $query->where(static function (Builder $active): void {
                    $active->where('is_active', true)->whereNull('deleted_at');
                });

                if ($linkedIds !== []) {
                    $query->orWhereIn('id', $linkedIds);
                }
            })
            ->orderBy('name')
            ->get(['id', 'name', 'asset_code']);
    }
}
