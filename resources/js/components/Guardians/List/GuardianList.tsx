import { useMemo } from 'react';
import {
    TableListFooter,
    TableListRowActions,
    TableListScroll,
    TableListTable,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import { guardianShowUrl } from '../Guardians.routes';
import type {
    GuardianListPermissions,
    GuardianPaginator,
    GuardianRecord,
} from '../Guardians.types';
import { guardianColumns } from './guardianColumns';

interface GuardianListProps {
    guardians: GuardianPaginator;
    relationships: Record<string, string>;
    permissions: GuardianListPermissions;
    loading: boolean;
    processing: boolean;
    onDelete: (guardian: GuardianRecord) => void;
    onPageSelect: (page: number) => void;
}

export default function GuardianList({
    guardians,
    relationships,
    permissions,
    loading,
    processing,
    onDelete,
    onPageSelect,
}: GuardianListProps): React.JSX.Element {
    const columns = useMemo<TableListColumn<GuardianRecord>[]>(
        () => [
            ...guardianColumns(relationships),
            {
                id: 'actions',
                label: 'Ações',
                width: '14%',
                fixed: 'end',
                render: (guardian) => (
                    <TableListRowActions
                        emptyLabel="Sem ações"
                        view={
                            permissions.view && {
                                href: guardianShowUrl(guardian.id),
                                label: `Visualizar responsável ${guardian.person.name}`,
                            }
                        }
                        remove={
                            permissions.delete && {
                                label: `Excluir responsável ${guardian.person.name}`,
                                disabled: processing,
                                onClick: () => onDelete(guardian),
                            }
                        }
                    />
                ),
            },
        ],
        [relationships, permissions.view, permissions.delete, processing, onDelete],
    );

    return (
        <>
            <TableListScroll aria-label="Tabela de responsáveis do aluno">
                <TableListTable
                    columns={columns}
                    rows={guardians.data}
                    rowKey={(guardian) => guardian.id}
                    page={guardians}
                    emptyMessage="Nenhum responsável encontrado para este aluno."
                />
            </TableListScroll>
            <TableListFooter
                page={guardians}
                disabled={loading}
                paginationLabel="Paginação de responsáveis"
                onSelect={onPageSelect}
            />
        </>
    );
}
