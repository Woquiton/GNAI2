<?php

declare(strict_types=1);

namespace App\Domains\UI\Presenters\Items;

use App\Domains\Domain\Models\Inspections\Inspection;
use App\Domains\Domain\Models\Inspections\InspectionEvidence;
use App\Domains\Domain\Models\Items\Item;
use App\Shared\Infrastructure\Security\RichTextSanitizer;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class ItemPresenter
{
    /**
     * @param  LengthAwarePaginator<int, Item>  $items
     * @return LengthAwarePaginator<int, Item>
     */
    public function items(LengthAwarePaginator $items): LengthAwarePaginator
    {
        $items->getCollection()->each(static function (Item $item): void {
            $item->setAttribute('conservation_state_label', $item->conservation_state?->label());
            $item->setAttribute('resource_status_label', $item->status?->label());
            $image = $item->relationLoaded('coverEvidence') ? $item->coverEvidence : null;
            $image ??= $item->relationLoaded('inspections')
                ? $item->inspections->first()?->evidences->first() : null;
            $item->setAttribute('catalog_image_url', $image
                ? '/storage/'.ltrim((string) $image->path, '/') : null);
            // O catálogo recebe somente a capa, sem os demais dados das vistorias.
            $item->unsetRelation('inspections');
            $item->unsetRelation('coverEvidence');
        });

        return $items;
    }

    /**
     * @return array<string, mixed>
     */
    public function display(Item $item): array
    {
        return [
            'itemTypeLabel' => $item->item_type?->label() ?? '---',
            'notesHtml' => RichTextSanitizer::sanitize((string) ($item->notes ?: '---')),
            'statusLabel' => $item->status?->label() ?? '---',
            'inspectionDetails' => $item->inspections->map(fn ($inspection) => [
                'id' => $inspection->id,
                'date' => $inspection->inspection_date?->format('d/m/Y') ?? '---',
                'type' => $inspection->type?->label() ?? '---',
                'state' => $inspection->state?->label() ?? '---',
                'descriptionHtml' => $inspection->description
                    ? RichTextSanitizer::sanitize((string) $inspection->description)
                    : null,
                'evidenceCount' => $inspection->evidences->count(),
            ])->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function inspection(Inspection $inspection): array
    {
        return [
            'date' => $inspection->inspection_date?->format('d/m/Y') ?? '---',
            'stateLabel' => $inspection->state?->label() ?? '---',
            'typeLabel' => $inspection->type?->label() ?? '---',
            'descriptionHtml' => RichTextSanitizer::sanitize(
                (string) ($inspection->description ?: 'Nenhum parecer técnico registrado.'),
            ),
            'evidences' => $inspection->evidences->map(
                static fn (InspectionEvidence $evidence): array => [
                    'id' => $evidence->id,
                    'name' => $evidence->displayName(),
                    'url' => '/storage/'.ltrim((string) $evidence->path, '/'),
                    'isImage' => $evidence->isImage(),
                    'iconClass' => $evidence->iconClass(),
                ],
            )->all(),
        ];
    }

    public function cover(Item $item): ?array
    {
        $evidence = $item->coverEvidence;

        return $evidence ? [
            'id' => $evidence->getKey(),
            'name' => $evidence->displayName(),
            'url' => '/storage/'.ltrim((string) $evidence->path, '/'),
        ] : null;
    }
}
