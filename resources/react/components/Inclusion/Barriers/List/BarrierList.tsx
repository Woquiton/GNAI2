import { useMemo } from 'react';
import {
    TableListFooter,
    TableListRowActions,
    TableListScroll,
    TableListTable,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import { barrierUrls } from '../Barriers.routes';
import type { BarrierListPermissions, BarrierPaginator, BarrierRecord } from '../Barriers.types';
import { barrierColumns } from './barrierColumns';

interface BarrierListProps {
    barriers: BarrierPaginator;
    permissions: BarrierListPermissions;
    loading: boolean;
    processing: boolean;
    onDelete: (barrier: BarrierRecord) => void;
    onPageSelect: (page: number) => void;
}

export default function BarrierList({
    barriers,
    permissions,
    loading,
    processing,
    onDelete,
    onPageSelect,
}: BarrierListProps): React.JSX.Element {
    const columns = useMemo<TableListColumn<BarrierRecord>[]>(
        () => [
            ...barrierColumns,
            {
                id: 'actions',
                label: 'Ações',
                width: '15%',
                fixed: 'end',
                render: (barrier) => (
                    <TableListRowActions
                        emptyLabel="Sem ações"
                        view={
                            permissions.show && {
                                href: barrierUrls.show(barrier.id),
                                label: `Visualizar ${barrier.name}`,
                            }
                        }
                        remove={
                            permissions.destroy && {
                                label: `Excluir ${barrier.name}`,
                                disabled: processing,
                                onClick: () => onDelete(barrier),
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
            <TableListScroll aria-label="Tabela de barreiras">
                <TableListTable
                    columns={columns}
                    rows={barriers.data}
                    rowKey={(barrier) => barrier.id}
                    page={barriers}
                    emptyMessage="Nenhuma barreira identificada até o momento."
                />
            </TableListScroll>
            <TableListFooter
                page={barriers}
                disabled={loading}
                paginationLabel="Paginação de barreiras"
                onSelect={onPageSelect}
            />
        </>
    );
}
