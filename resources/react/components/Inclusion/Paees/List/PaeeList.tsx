import { useMemo } from 'react';
import {
    TableListFooter,
    TableListRowActions,
    TableListScroll,
    TableListTable,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import { paeeName } from '../Paees.constants';
import { paeeUrls } from '../Paees.routes';
import type { PaeeListPermissions, PaeeListRecord, PaeePaginator } from '../Paees.types';
import { paeeAllColumns } from './paeeColumns';

interface PaeeListProps {
    paees: PaeePaginator;
    permissions: PaeeListPermissions;
    loading: boolean;
    processing: boolean;
    onDelete: (paee: PaeeListRecord) => void;
    onPageSelect: (page: number) => void;
}

export default function PaeeList({
    paees,
    permissions,
    loading,
    processing,
    onDelete,
    onPageSelect,
}: PaeeListProps): React.JSX.Element {
    const columns = useMemo<TableListColumn<PaeeListRecord>[]>(
        () => [
            ...paeeAllColumns,
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
                        edit={
                            permissions.update && {
                                href: paeeUrls.edit(paee.id),
                                label: `Editar ${paeeName(paee)}`,
                            }
                        }
                        remove={
                            permissions.delete && {
                                label: `Excluir ${paeeName(paee)}`,
                                disabled: processing,
                                onClick: () => onDelete(paee),
                            }
                        }
                    />
                ),
            },
        ],
        [permissions.view, permissions.update, permissions.delete, processing, onDelete],
    );

    return (
        <>
            <TableListScroll aria-label="Tabela de PAEEs">
                <TableListTable
                    columns={columns}
                    rows={paees.data}
                    rowKey={(paee) => paee.id}
                    page={paees}
                    emptyMessage="Nenhum PAEE encontrado."
                />
            </TableListScroll>
            <TableListFooter
                page={paees}
                disabled={loading}
                paginationLabel="Paginação de PAEEs"
                onSelect={onPageSelect}
            />
        </>
    );
}
