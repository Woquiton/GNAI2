import { useMemo } from 'react';
import {
    TableListFooter,
    TableListRowActions,
    TableListScroll,
    TableListTable,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import { barrierCategoryUrls } from '../BarrierCategories.routes';
import type {
    BarrierCategoryListPermissions,
    BarrierCategoryPaginator,
    BarrierCategoryRecord,
} from '../BarrierCategories.types';
import { barrierCategoryColumns } from './barrierCategoryColumns';

interface BarrierCategoryListProps {
    categories: BarrierCategoryPaginator;
    permissions: BarrierCategoryListPermissions;
    loading: boolean;
    processing: boolean;
    onDelete: (category: BarrierCategoryRecord) => void;
    onPageSelect: (page: number) => void;
}

export default function BarrierCategoryList({
    categories,
    permissions,
    loading,
    processing,
    onDelete,
    onPageSelect,
}: BarrierCategoryListProps): React.JSX.Element {
    const columns = useMemo<TableListColumn<BarrierCategoryRecord>[]>(
        () => [
            ...barrierCategoryColumns,
            {
                id: 'actions',
                label: 'Ações',
                width: '20%',
                fixed: 'end',
                render: (category) => (
                    <TableListRowActions
                        emptyLabel="Sem ações"
                        view={
                            permissions.show && {
                                href: barrierCategoryUrls.show(category.id),
                                label: `Visualizar ${category.name}`,
                            }
                        }
                        remove={
                            permissions.destroy && {
                                label: `Excluir ${category.name}`,
                                disabled: processing,
                                onClick: () => onDelete(category),
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
            <TableListScroll aria-label="Tabela de categorias de barreiras">
                <TableListTable
                    columns={columns}
                    rows={categories.data}
                    rowKey={(category) => category.id}
                    page={categories}
                    emptyMessage="Nenhuma categoria encontrada."
                />
            </TableListScroll>
            <TableListFooter
                page={categories}
                disabled={loading}
                paginationLabel="Paginação de categorias de barreiras"
                onSelect={onPageSelect}
            />
        </>
    );
}
