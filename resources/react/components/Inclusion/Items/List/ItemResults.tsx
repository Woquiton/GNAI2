import { useEffect, useId, useRef, useState } from 'react';
import { useTableViewPreference } from '@/components/Tables/TableList/useTableViewPreference';
import { TableListFooter } from '@/components/Tables/TableList/TableList';
import SegmentedControl from '@/components/UI/SegmentedControl/SegmentedControl';
import {
    TABLE_LIST_CATALOG_PAGE_SIZES,
    type TableListViewMode,
} from '@/components/Tables/TableList/TableList.preferences';
import { ITEM_TOUR_TARGETS } from '../itemTours';
import ItemCatalog from './ItemCatalog';
import ItemList from './ItemList';
import type { ItemResultsProps } from './ItemList.types';
import { useItemListTourBridge } from './itemListTourBridge';
import './ItemResults.css';

export default function ItemResults(props: ItemResultsProps): React.JSX.Element {
    const { view: savedView, selectView } = useTableViewPreference();
    const [tourView, setTourView] = useState<TableListViewMode | null>(null);
    const view = tourView ?? savedView;
    useItemListTourBridge(setTourView);
    const id = useId();
    const requestedSize = useRef<number | null>(null);
    const perPage = props.items.per_page ?? 10;
    const changePageSize = useRef(props.onPageSizeSelect);
    changePageSize.current = props.onPageSizeSelect;

    useEffect(() => {
        if (tourView !== null) return;
        if (view !== 'catalog') {
            requestedSize.current = null;
            return;
        }
        if (TABLE_LIST_CATALOG_PAGE_SIZES.some((size) => size === perPage)) {
            requestedSize.current = null;
            return;
        }
        const next = TABLE_LIST_CATALOG_PAGE_SIZES.reduce((closest, size) =>
            Math.abs(size - perPage) < Math.abs(closest - perPage) ? size : closest,
        );
        if (requestedSize.current === next) return;
        requestedSize.current = next;
        changePageSize.current(next);
    }, [view, perPage, tourView]);
    return (
        <>
            <div className="itemResults__toolbar">
                <SegmentedControl<TableListViewMode>
                    label="Visualização dos itens"
                    value={view}
                    onChange={(next) => {
                        setTourView(null);
                        selectView(next);
                    }}
                    tourTarget={ITEM_TOUR_TARGETS.viewMode}
                    options={[
                        {
                            value: 'list',
                            label: 'Listagem',
                            iconClass: 'fa fa-list',
                            controls: `${id}-list`,
                        },
                        {
                            value: 'catalog',
                            label: 'Catálogo',
                            iconClass: 'fa fa-th-large',
                            controls: `${id}-catalog`,
                        },
                    ]}
                />
            </div>
            <div
                id={`${id}-list`}
                className="itemResults__view"
                data-item-view="list"
                hidden={view !== 'list'}
            >
                <ItemList {...props} />
            </div>
            <div id={`${id}-catalog`} data-item-view="catalog" hidden={view !== 'catalog'}>
                <ItemCatalog {...props} active={view === 'catalog'} />
            </div>
            <TableListFooter
                page={props.items}
                disabled={props.loading}
                paginationLabel="Páginas de itens"
                onSelect={props.onPageSelect}
                pageSizeOptions={view === 'catalog' ? TABLE_LIST_CATALOG_PAGE_SIZES : undefined}
            />
        </>
    );
}
