import { useMemo } from 'react';
import {
    TableListFooter,
    TableListRowActions,
    TableListScroll,
    TableListTable,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import { dateLabel } from '@/utils/formatters';
import { studentAeeRecordUrls } from '../AeeRecords.routes';
import type {
    AeeStudentEvaluationListItem,
    AeeStudentEvaluationListPermissions,
    AeeStudentEvaluationPaginator,
} from '../AeeRecords.types';
import { studentAeeRecordColumns } from './studentAeeRecordColumns';

interface StudentAeeRecordListProps {
    studentId: number;
    aeeEvaluations: AeeStudentEvaluationPaginator;
    permissions: AeeStudentEvaluationListPermissions;
    loading: boolean;
    processing: boolean;
    onDelete: (evaluation: AeeStudentEvaluationListItem) => void;
    onPageSelect: (page: number) => void;
}

/**
 * Tabela e paginação das avaliações AEE do aluno. Editar e excluir exigem a permissão e a autoria
 * do atendimento (`can_manage`).
 */
export default function StudentAeeRecordList({
    studentId,
    aeeEvaluations,
    permissions,
    loading,
    processing,
    onDelete,
    onPageSelect,
}: StudentAeeRecordListProps): React.JSX.Element {
    const columns = useMemo<TableListColumn<AeeStudentEvaluationListItem>[]>(() => {
        const urls = studentAeeRecordUrls(studentId);

        return [
            ...studentAeeRecordColumns,
            {
                id: 'actions',
                label: 'Ações',
                width: '22%',
                fixed: 'end',
                render: (evaluation) => {
                    const date = dateLabel(evaluation.aee_record?.attendance_session?.session_date);

                    return (
                        <TableListRowActions
                            view={
                                permissions.view && {
                                    href: urls.show(evaluation.id),
                                    label: `Visualizar atendimento de ${date}`,
                                }
                            }
                            edit={
                                permissions.update &&
                                evaluation.can_manage && {
                                    href: urls.edit(evaluation.id),
                                    label: `Editar atendimento de ${date}`,
                                }
                            }
                            remove={
                                permissions.delete &&
                                evaluation.can_manage && {
                                    label: `Excluir atendimento de ${date}`,
                                    disabled: processing,
                                    onClick: () => onDelete(evaluation),
                                }
                            }
                            emptyLabel="Sem ações"
                        />
                    );
                },
            },
        ];
    }, [studentId, permissions.view, permissions.update, permissions.delete, processing, onDelete]);

    return (
        <>
            <TableListScroll aria-label="Tabela de registros de atendimento AEE do aluno">
                <TableListTable
                    columns={columns}
                    rows={aeeEvaluations.data}
                    rowKey={(evaluation) => evaluation.id}
                    page={aeeEvaluations}
                    emptyMessage="Nenhum registro encontrado."
                />
            </TableListScroll>
            <TableListFooter
                page={aeeEvaluations}
                disabled={loading}
                paginationLabel="Paginação de registros de atendimento AEE do aluno"
                onSelect={onPageSelect}
            />
        </>
    );
}
