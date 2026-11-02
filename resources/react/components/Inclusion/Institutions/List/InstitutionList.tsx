import { useMemo } from 'react';
import {
    TableListFooter,
    TableListRowActions,
    TableListScroll,
    TableListTable,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import { institutionUrls } from '../Institutions.routes';
import type {
    InstitutionListPermissions,
    InstitutionPaginator,
    InstitutionRecord,
} from '../Institutions.types';
import { institutionColumns } from './institutionColumns';

interface InstitutionListProps {
    institutions: InstitutionPaginator;
    permissions: InstitutionListPermissions;
    loading: boolean;
    processing: boolean;
    onDelete: (institution: InstitutionRecord) => void;
    onPageSelect: (page: number) => void;
}

export default function InstitutionList({
    institutions,
    permissions,
    loading,
    processing,
    onDelete,
    onPageSelect,
}: InstitutionListProps): React.JSX.Element {
    const columns = useMemo<TableListColumn<InstitutionRecord>[]>(
        () => [
            ...institutionColumns,
            {
                id: 'actions',
                label: 'Ações',
                width: '18%',
                fixed: 'end',
                render: (institution) => (
                    <TableListRowActions
                        emptyLabel="Sem ações"
                        view={
                            permissions.show && {
                                href: institutionUrls.show(institution.id),
                                label: `Visualizar ${institution.name}`,
                            }
                        }
                        remove={
                            permissions.destroy && {
                                label: `Excluir ${institution.name}`,
                                disabled: processing,
                                onClick: () => onDelete(institution),
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
            <TableListScroll aria-label="Tabela de instituições">
                <TableListTable
                    columns={columns}
                    rows={institutions.data}
                    rowKey={(institution) => institution.id}
                    page={institutions}
                    emptyMessage="Nenhuma instituição cadastrada."
                />
            </TableListScroll>
            <TableListFooter
                page={institutions}
                disabled={loading}
                paginationLabel="Paginação de instituições"
                onSelect={onPageSelect}
            />
        </>
    );
}
