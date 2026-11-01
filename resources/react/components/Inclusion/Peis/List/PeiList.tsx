import { useMemo } from 'react';
import {
    TableListFooter,
    TableListRowActions,
    TableListScroll,
    TableListTable,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import { peiDisplayName } from '../Peis.constants';
import { peiUrls } from '../Peis.routes';
import type {
    PeiListPermissions,
    PeiListRecord,
    PeiListVariant,
    PeiPaginator,
} from '../Peis.types';
import { allPeiColumns, studentPeiColumns } from './peiColumns';

interface PeiListProps {
    variant: PeiListVariant;
    peis: PeiPaginator;
    permissions: PeiListPermissions;
    loading: boolean;
    processing: boolean;
    onDelete: (pei: PeiListRecord) => void;
    onPageSelect: (page: number) => void;
}

/** Tabela paginada da listagem geral e do histórico de PEIs do aluno. */
export default function PeiList({
    variant,
    peis,
    permissions,
    loading,
    processing,
    onDelete,
    onPageSelect,
}: PeiListProps): React.JSX.Element {
    const isStudent = variant === 'student';
    const columns = useMemo<TableListColumn<PeiListRecord>[]>(
        () => [
            ...(isStudent ? studentPeiColumns : allPeiColumns),
            {
                id: 'actions',
                label: 'Ações',
                width: isStudent ? '16%' : '14%',
                fixed: 'end',
                render: (pei) => (
                    <TableListRowActions
                        view={
                            permissions.view && {
                                href: peiUrls.show(pei.id),
                                label: `Visualizar ${peiDisplayName(pei)}`,
                            }
                        }
                        remove={
                            permissions.delete && {
                                label: `Excluir ${peiDisplayName(pei)}`,
                                disabled: processing,
                                onClick: () => onDelete(pei),
                            }
                        }
                    />
                ),
            },
        ],
        [isStudent, permissions.view, permissions.delete, processing, onDelete],
    );
    const emptyMessage = isStudent
        ? 'Nenhum PEI do aluno encontrado no sistema.'
        : 'Nenhum PEI encontrado no sistema.';

    return (
        <>
            <TableListScroll aria-label="Tabela de PEIs">
                <TableListTable
                    columns={columns}
                    rows={peis.data}
                    rowKey={(pei) => pei.id}
                    page={peis}
                    emptyMessage={emptyMessage}
                />
            </TableListScroll>
            <TableListFooter
                page={peis}
                disabled={loading}
                paginationLabel="Paginação de PEIs"
                onSelect={onPageSelect}
            />
        </>
    );
}
