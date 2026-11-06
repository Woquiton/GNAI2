import { useCallback } from 'react';
import EmptyText from '@/components/UI/EmptyText/EmptyText';
import { notifyOperationFailure } from '@/components/UI/NotificationToast/operationFeedback';
import { useIsotopeLayout } from '@/hooks/useIsotopeLayout';
import { ITEM_TOUR_TARGETS } from '../itemTours';
import ItemCatalogCard from './ItemCatalogCard';
import type { ItemResultsProps } from './ItemList.types';

interface ItemCatalogProps extends ItemResultsProps {
    active: boolean;
}

export default function ItemCatalog({
    items,
    permissions,
    processing,
    onDelete,
    active,
    itemTypeFilter,
}: ItemCatalogProps): React.JSX.Element {
    const onLayoutError = useCallback(() => {
        notifyOperationFailure(
            'Não foi possível carregar as animações do catálogo. Os itens continuam disponíveis.',
        );
    }, []);
    const selected = itemTypeFilter ? `.${itemTypeFilter}` : '*';
    const host = useIsotopeLayout<HTMLUListElement>(selected, '.itemCatalog__item', items.data, {
        enabled: active,
        onError: onLayoutError,
    });
    return (
        <section
            className="itemCatalog"
            aria-label="Catálogo de itens"
            data-tour={ITEM_TOUR_TARGETS.catalog}
        >
            {!items.data.length ? (
                <EmptyText className="itemCatalog__empty">
                    Nenhum item encontrado para os filtros selecionados.
                </EmptyText>
            ) : null}
            <ul ref={host} className="itemCatalog__grid">
                {items.data.map((item) => (
                    <li key={item.id} className={`itemCatalog__item ${item.item_type}`}>
                        <ItemCatalogCard
                            item={item}
                            permissions={permissions}
                            processing={processing}
                            onDelete={onDelete}
                        />
                    </li>
                ))}
            </ul>
        </section>
    );
}
