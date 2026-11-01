import { useMemo } from 'react';
import {
    TableListCard,
    TableListRowActions,
    TableListScroll,
    TableListSummary,
    TableListTable,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import { paeeName } from '../Paees.constants';
import { paeeUrls } from '../Paees.routes';
import type { PaeeListPermissions, PaeeListRecord } from '../Paees.types';
import { paeeHistoryColumns } from './paeeColumns';

interface PaeeHistoryListProps {
    paees: PaeeListRecord[];
    permissions: PaeeListPermissions;
}

/** Histórico completo de versões do aluno, sem paginação: a contagem é estática. */
export default function PaeeHistoryList({
    paees,
    permissions,
}: PaeeHistoryListProps): React.JSX.Element {
    const summary = `${paees.length} ${paees.length === 1 ? 'registro' : 'registros'}`;
    const columns = useMemo<TableListColumn<PaeeListRecord>[]>(
        () => [
            ...paeeHistoryColumns,
            {
                id: 'actions',
                label: 'Ações',
                width: '14%',
                fixed: 'end',
                render: (paee) => (
                    <TableListRowActions
                        view={
                            permissions.view && {
                                href: paeeUrls.show(paee.id),
                                label: `Visualizar ${paeeName(paee)}`,
                            }
                        }
                    />
                ),
            },
        ],
        [permissions.view],
    );

    return (
        <TableListCard aria-label="Histórico de PAEE do aluno">
            <TableListScroll aria-label="Tabela do histórico de PAEE">
                <TableListTable
                    columns={columns}
                    rows={paees}
                    rowKey={(paee) => paee.id}
                    summary={summary}
                    emptyMessage="Nenhum PAEE encontrado."
                />
            </TableListScroll>
            <TableListSummary>{summary}</TableListSummary>
        </TableListCard>
    );
}
