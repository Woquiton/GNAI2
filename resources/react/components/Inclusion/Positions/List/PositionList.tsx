import { useMemo } from 'react';
import {
    TableListFooter,
    TableListRowActions,
    TableListScroll,
    TableListTable,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import { positionUrls } from '../Positions.routes';
import type {
    PositionListPermissions,
    PositionPaginator,
    PositionSummary,
} from '../Positions.types';
import { positionColumns } from './positionColumns';

interface PositionListProps {
    positions: PositionPaginator;
    permissions: PositionListPermissions;
    loading: boolean;
    deleting: boolean;
    onDelete: (position: PositionSummary) => void;
    onPageSelect: (page: number) => void;
}

export default function PositionList({
    positions,
    permissions,
    loading,
    deleting,
    onDelete,
    onPageSelect,
}: PositionListProps): React.JSX.Element {
    const columns = useMemo<TableListColumn<PositionSummary>[]>(
        () => [
            ...positionColumns,
            {
                id: 'actions',
                label: 'Ações',
                width: '22%',
                fixed: 'end',
                render: (position) => (
                    <TableListRowActions
                        emptyLabel="Sem ações"
                        view={
                            permissions.view && {
                                href: positionUrls.show(position.id),
                                label: `Visualizar ${position.name}`,
                            }
                        }
                        remove={
                            permissions.delete && {
                                label: `Excluir ${position.name}`,
                                disabled: deleting,
                                onClick: () => onDelete(position),
                            }
                        }
                    />
                ),
            },
        ],
        [permissions.view, permissions.delete, deleting, onDelete],
    );

    return (
        <>
            <TableListScroll aria-label="Tabela de cargos">
                <TableListTable
                    className="positionList"
                    columns={columns}
                    rows={positions.data}
                    rowKey={(position) => position.id}
                    page={positions}
                    emptyMessage="Nenhum cargo encontrado."
                />
            </TableListScroll>
            <TableListFooter
                page={positions}
                disabled={loading}
                paginationLabel="Paginação de cargos"
                onSelect={onPageSelect}
            />
        </>
    );
}
