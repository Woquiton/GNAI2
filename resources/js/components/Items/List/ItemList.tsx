import { useMemo } from 'react';
import {
    TableListRowActions,
    TableListScroll,
    TableListTable,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import { itemUrls } from '../Items.routes';
import type { ItemSummary } from '../Items.types';
import { itemColumns } from './itemColumns';
import type { ItemListProps } from './ItemList.types';

export default function ItemList({
    items,
    permissions,
    processing,
    onDelete,
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
    );
}
