import { useMemo } from 'react';
import {
    TableListFooter,
    TableListRowActions,
    TableListScroll,
    TableListTable,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import Button from '@/components/UI/Button/Button';
import { dateLabel } from '@/utils/formatters';
import { pedagogicalRecordUrls } from '../PedagogicalRecords.routes';
import type {
    PedagogicalRecordListAbilities,
    PedagogicalRecordListRow,
    PedagogicalRecordPaginator,
} from '../PedagogicalRecords.types';
import { generalRecordColumns, studentRecordColumns } from './pedagogicalRecordColumns';

interface PedagogicalRecordListProps {
    records: PedagogicalRecordPaginator;
    /** `student`: histórico do aluno, com edição e exclusão dos registros gerenciáveis. */
    variant: 'general' | 'student';
    permissions: PedagogicalRecordListAbilities;
    /** Aluno de origem, mantido nos links para retornar ao prontuário. */
    studentId?: number;
    loading: boolean;
    processing?: boolean;
    onDelete?: (record: PedagogicalRecordListRow) => void;
    onPageSelect: (page: number) => void;
}

function recordSubject(record: PedagogicalRecordListRow, isStudent: boolean): string {
    const date = dateLabel(record.session_date);

    return isStudent
        ? `atendimento de ${date}`
        : `atendimento de ${record.student_name ?? 'estudante não informado'} em ${date}`;
}

export default function PedagogicalRecordList({
    records,
    variant,
    permissions,
    studentId,
    loading,
    processing = false,
    onDelete,
    onPageSelect,
}: PedagogicalRecordListProps): React.JSX.Element {
    const isStudent = variant === 'student';
    const linkStudentId = isStudent ? studentId : undefined;
    const columns = useMemo<TableListColumn<PedagogicalRecordListRow>[]>(() => {
        function renderActions(record: PedagogicalRecordListRow): React.JSX.Element {
            const subject = recordSubject(record, isStudent);
            const manageable = isStudent && record.can_manage;

            return (
                <TableListRowActions
                    emptyLabel="Sem ações"
                    view={
                        permissions.view && {
                            href: pedagogicalRecordUrls.show(record.id, linkStudentId),
                            label: `Visualizar ${subject}`,
                        }
                    }
                    edit={
                        manageable &&
                        permissions.update && {
                            href: pedagogicalRecordUrls.edit(record.id, linkStudentId),
                            label: `Editar ${subject}`,
                        }
                    }
                    remove={
                        manageable &&
                        permissions.delete &&
                        onDelete !== undefined && {
                            label: `Excluir ${subject}`,
                            disabled: processing,
                            onClick: () => onDelete(record),
                        }
                    }
                >
                    {permissions.view ? (
                        <Button
                            href={pedagogicalRecordUrls.pdf(record.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="sm"
                            tone="cancel"
                            iconOnly
                            leftIconClass="fa fa-file-pdf-o"
                            title="PDF"
                            aria-label={`Gerar PDF do ${subject}`}
                        />
                    ) : null}
                </TableListRowActions>
            );
        }

        return [
            ...(isStudent ? studentRecordColumns : generalRecordColumns),
            {
                id: 'actions',
                label: 'Ações',
                width: isStudent ? '20%' : '11%',
                fixed: 'end',
                render: renderActions,
            },
        ];
    }, [isStudent, linkStudentId, permissions, processing, onDelete]);

    return (
        <>
            <TableListScroll aria-label="Tabela de atendimentos pedagógicos">
                <TableListTable
                    columns={columns}
                    rows={records.data}
                    rowKey={(record) => record.id}
                    page={records}
                    emptyMessage="Nenhum atendimento pedagógico encontrado."
                />
            </TableListScroll>
            <TableListFooter
                page={records}
                disabled={loading}
                paginationLabel="Paginação de atendimentos pedagógicos"
                onSelect={onPageSelect}
            />
        </>
    );
}
