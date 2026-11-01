import { useMemo } from 'react';
import {
    TableListFooter,
    TableListRowActions,
    TableListScroll,
    TableListTable,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import { itemUrls } from '../Items.routes';
import type { ItemListPermissions, ItemPaginator, ItemSummary } from '../Items.types';
import { itemColumns } from './itemColumns';

interface ItemListProps {
    items: ItemPaginator;
    permissions: ItemListPermissions;
    loading: boolean;
    processing: boolean;
    onDelete: (item: ItemSummary) => void;
    onPageSelect: (page: number) => void;
}

export default function ItemList({
    items,
    permissions,
    loading,
    processing,
    onDelete,
    onPageSelect,
}: ItemListProps): React.JSX.Element {
    const columns = useMemo<TableListColumn<ItemSummary>[]>(
        () => [
            ...itemColumns,
            {
                id: 'actions',
                label: 'Ações',
                width: '16%',
                fixed: 'end',
                render: (item) => (
                    <TableListRowActions
                        view={
                            permissions.show && {
                                href: itemUrls.show(item.id),
                                label: `Visualizar ${item.name}`,
                            }
                        }
                        remove={
                            permissions.destroy && {
                                label: `Excluir ${item.name}`,
                                disabled: processing,
                                onClick: () => onDelete(item),
                            }
                        }
                    />
                ),
            },
        ],
        [permissions.show, permissions.destroy, processing, onDelete],
    );

    return (
        <>
            <TableListScroll aria-label="Tabela de itens">
                <TableListTable
                    className="itemList"
                    columns={columns}
                    rows={items.data}
                    rowKey={(item) => item.id}
                    page={items}
                    emptyMessage="Nenhum item cadastrado."
                />
            </TableListScroll>
            <TableListFooter
                page={items}
                disabled={loading}
                paginationLabel="Páginas de itens"
                onSelect={onPageSelect}
            />
        </>
    );
}
