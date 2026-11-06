<?php

declare(strict_types=1);

namespace App\Domains\UI\Presenters\Dashboard;

use App\Domains\Domain\Models\Audit\AuditRecord;
use App\Domains\Domain\Models\Auth\User;
use App\Domains\Domain\Enums\Dashboard\ActivityFeedSource;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;

/**
 * Itens do feed de atividades na mesma frase da tela de Auditoria ("Maria alterou o PAEE #3 de João").
 * Nunca expõe o conteúdo do documento. O item vira link quando o documento existe e o usuário pode abri-lo.
 */
final class ActivityFeedPresenter
{
    /**
     * @param  LengthAwarePaginator<int, AuditRecord>  $records
     * @return array{items: list<array{id: int, sentence: string, href: string|null, createdAt: string|null}>, nextPage: int|null}
     */
    public function page(LengthAwarePaginator $records, User $user): array
    {
        /** @var list<AuditRecord> $page */
        $page = $records->items();
        $entities = $this->entities($page);
        $items = [];

        foreach ($page as $record) {
            $source = ActivityFeedSource::from($record->entity_type);
            $entity = $entities[$record->entity_type][$record->entity_id] ?? null;

            $items[] = [
                'id' => $record->id,
                'sentence' => "{$record->author()} {$record->event->verb()} {$record->entity_description}",
                'href' => $entity !== null && $user->can($source->ability()) ? $source->url($entity) : null,
                'createdAt' => $record->created_at?->format('d/m/Y H:i'),
            ];
        }

        return [
            'items' => $items,
            'nextPage' => $records->hasMorePages() ? $records->currentPage() + 1 : null,
        ];
    }

    /** @return list<array{value: string, label: string}> */
    public function modelOptions(): array
    {
        return array_map(
            fn (ActivityFeedSource $source): array => ['value' => $source->value, 'label' => $source->label()],
            ActivityFeedSource::cases(),
        );
    }

    /**
     * Documentos que ainda existem, por tipo e id, buscados uma vez por tipo.
     *
     * @param  list<AuditRecord>  $records
     * @return array<string, array<string, Model>>
     */
    private function entities(array $records): array
    {
        $idsByType = [];

        foreach ($records as $record) {
            $idsByType[$record->entity_type][] = $record->entity_id;
        }

        $entities = [];

        foreach ($idsByType as $type => $ids) {
            $entities[$type] = ActivityFeedSource::from($type)->modelClass()::query()
                ->whereKey(array_values(array_unique($ids)))
                ->get()
                ->keyBy(fn (Model $entity): string => (string) $entity->getKey())
                ->all();
        }

        return $entities;
    }
}
