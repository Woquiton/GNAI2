import { useMemo } from 'react';
import {
    TableListFooter,
    TableListRowActions,
    TableListScroll,
    TableListTable,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import { studentDeficiencyUrls } from '../StudentDeficiencies.routes';
import type {
    StudentDeficiencyListPermissions,
    StudentDeficiencyListRecord,
    StudentDeficiencyPaginator,
} from '../StudentDeficiencies.types';
import { profileName, studentDeficiencyColumns } from './studentDeficiencyColumns';

interface StudentDeficiencyListProps {
    studentId: number;
    deficiencies: StudentDeficiencyPaginator;
    permissions: StudentDeficiencyListPermissions;
    loading: boolean;
    processing: boolean;
    onDelete: (profile: StudentDeficiencyListRecord) => void;
    onPageSelect: (page: number) => void;
}

export default function StudentDeficiencyList({
    studentId,
    deficiencies,
    permissions,
    loading,
    processing,
    onDelete,
    onPageSelect,
}: StudentDeficiencyListProps): React.JSX.Element {
    const columns = useMemo<TableListColumn<StudentDeficiencyListRecord>[]>(
        () => [
            ...studentDeficiencyColumns,
            {
                id: 'actions',
                label: 'Ações',
                width: '28%',
                fixed: 'end',
                render: (profile) => (
                    <TableListRowActions
                        view={
                            permissions.view && {
                                href: studentDeficiencyUrls.show(studentId, profile.id),
                                label: `Visualizar perfil ${profileName(profile)}`,
                            }
                        }
                        remove={
                            permissions.delete && {
                                label: `Excluir perfil ${profileName(profile)}`,
                                disabled: processing,
                                onClick: () => onDelete(profile),
                            }
                        }
                    />
                ),
            },
        ],
        [studentId, permissions.view, permissions.delete, processing, onDelete],
    );

    return (
        <>
            <TableListScroll aria-label="Tabela de perfis de atendimento do aluno">
                <TableListTable
                    columns={columns}
                    rows={deficiencies.data}
                    rowKey={(profile) => profile.id}
                    page={deficiencies}
                    emptyMessage="Nenhum perfil de atendimento do aluno encontrado."
                />
            </TableListScroll>
            <TableListFooter
                page={deficiencies}
                disabled={loading}
                paginationLabel="Paginação de perfis de atendimento"
                onSelect={onPageSelect}
            />
        </>
    );
}
