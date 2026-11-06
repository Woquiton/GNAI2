import { useMemo } from 'react';
import {
    TableListFooter,
    TableListRowActions,
    TableListScroll,
    TableListTable,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import { professionalUrls } from '../Professionals.routes';
import type {
    ProfessionalListPermissions,
    ProfessionalListRecord,
    ProfessionalPaginator,
} from '../Professionals.types';
import { professionalColumns } from './professionalColumns';

interface ProfessionalListProps {
    professionals: ProfessionalPaginator;
    professionalStatuses: Record<string, string>;
    professionalStatusColors: Record<string, string>;
    permissions: ProfessionalListPermissions;
    loading: boolean;
    processing: boolean;
    onDelete: (professional: ProfessionalListRecord) => void;
    onPageSelect: (page: number) => void;
}

export default function ProfessionalList({
    professionals,
    professionalStatuses,
    professionalStatusColors,
    permissions,
    loading,
    processing,
    onDelete,
    onPageSelect,
}: ProfessionalListProps): React.JSX.Element {
    const columns = useMemo<TableListColumn<ProfessionalListRecord>[]>(
        () => [
            ...professionalColumns({
                labels: professionalStatuses,
                tones: professionalStatusColors,
            }),
            {
                id: 'actions',
                label: 'Ações',
                width: '14%',
                fixed: 'end',
                render: (professional) => (
                    <TableListRowActions
                        view={
                            permissions.view && {
                                href: professionalUrls.show(professional.id),
                                label: `Visualizar prontuário de ${professional.person.name}`,
                            }
                        }
                        remove={
                            permissions.delete && {
                                label: `Excluir profissional ${professional.person.name} do sistema`,
                                disabled: processing,
                                onClick: () => onDelete(professional),
                            }
                        }
                    />
                ),
            },
        ],
        [
            professionalStatuses,
            professionalStatusColors,
            permissions.view,
            permissions.delete,
            processing,
            onDelete,
        ],
    );

    return (
        <>
            <TableListScroll aria-label="Tabela de profissionais do suporte educacional">
                <TableListTable
                    columns={columns}
                    rows={professionals.data}
                    rowKey={(professional) => professional.id}
                    page={professionals}
                    emptyMessage="Nenhum profissional encontrado."
                />
            </TableListScroll>
            <TableListFooter
                page={professionals}
                disabled={loading}
                paginationLabel="Paginação de profissionais"
                onSelect={onPageSelect}
            />
        </>
    );
}
