import { useMemo } from 'react';
import { supportRequestColumns } from '@/components/SupportRequests/List/supportRequestColumns';
import SupportRequestDeleteModal from '@/components/SupportRequests/SupportRequestDeleteModal';
import { supportRequestUrls } from '@/components/SupportRequests/SupportRequests.routes';
import type { SupportRequestSummary } from '@/components/SupportRequests/SupportRequests.types';
import type { TabItem } from '@/components/Navigation/Tabs/Tabs';
import {
    TableListCreateButton,
    TableListRowActions,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';
import StudentRecordTable from '../StudentRecordTable';
import type { Permissions, StudentRecord, StudentRecordTabId } from '../Students.types';
import StudentRecordFilters, {
    matchesStudentRecordFilter,
    useStudentRecordFilters,
} from './StudentRecordFilters';

interface StudentSupportRequestsProps {
    student: StudentRecord;
    permissions: Permissions;
    supportRequests: SupportRequestSummary[];
    loadingTab: StudentRecordTabId | null;
}

function StudentSupportRequests({
    student,
    permissions,
    supportRequests,
    loadingTab,
}: StudentSupportRequestsProps): React.JSX.Element {
    const filters = useStudentRecordFilters(['protocol', 'requester', 'status'] as const);
    const removal = useConfirmedAction<SupportRequestSummary>({
        failureText: 'Não foi possível excluir a solicitação. Tente novamente.',
    });
    const rows = supportRequests.filter(
        (record) =>
            matchesStudentRecordFilter(`#${record.id}`, filters.values.protocol) &&
            matchesStudentRecordFilter(record.requester_name, filters.values.requester) &&
            matchesStudentRecordFilter(record.status_label, filters.values.status),
    );
    const columns = useMemo<TableListColumn<SupportRequestSummary>[]>(
        () => [
            ...supportRequestColumns
                .filter((column) => !['student', 'registration'].includes(column.id))
                .map((column) =>
                    column.id === 'protocol' ? { ...column, fixed: 'start' as const } : column,
                ),
            {
                id: 'actions',
                label: 'Ações',
                width: '12%',
                fixed: 'end',
                render: (record) => (
                    <TableListRowActions
                        view={
                            permissions['support-request.view'] && {
                                href: supportRequestUrls.show(record.id, true),
                                label: `Visualizar solicitação #${record.id}`,
                            }
                        }
                        edit={
                            permissions['support-request.update'] && {
                                href: supportRequestUrls.edit(record.id, true),
                                label: `Editar solicitação #${record.id}`,
                            }
                        }
                        remove={
                            permissions['support-request.delete'] && {
                                label: `Excluir solicitação #${record.id}`,
                                disabled: removal.processing,
                                onClick: () => removal.open(record),
                            }
                        }
                    />
                ),
            },
        ],
        [permissions, removal.processing, removal.open],
    );
    const createAction = permissions['support-request.create'] ? (
        <TableListCreateButton
            href={supportRequestUrls.createForStudent(student.id, true)}
            ariaLabel="Cadastrar solicitação de atendimento para o aluno"
        />
    ) : undefined;

    return (
        <div id="support-requests">
            <StudentRecordTable
                ariaLabel="Solicitações de atendimento do aluno"
                columns={columns}
                rows={rows}
                rowKey={(record) => record.id}
                emptyMessage="Nenhuma solicitação de atendimento encontrada."
                actions={createAction}
                loading={loadingTab === 'support-requests'}
                filters={
                    <StudentRecordFilters
                        idPrefix="student-support-request-filter"
                        label="Filtrar solicitações do aluno"
                        fields={[
                            { name: 'protocol', label: 'Protocolo' },
                            { name: 'requester', label: 'Solicitante' },
                            { name: 'status', label: 'Situação' },
                        ]}
                        values={filters.values}
                        onChange={filters.update}
                        onClear={filters.clear}
                    />
                }
            />
            <SupportRequestDeleteModal
                target={removal.target}
                processing={removal.processing}
                onClose={removal.close}
                onConfirm={() => {
                    if (removal.target)
                        removal.submit(
                            'delete',
                            supportRequestUrls.destroy(removal.target.id, true),
                        );
                }}
            />
        </div>
    );
}

export function createStudentSupportRequestTabs(props: StudentSupportRequestsProps): TabItem[] {
    if (!props.permissions['support-request.view']) return [];
    return [
        {
            id: 'support-requests',
            label: 'Solicitações',
            icon: 'ti-receipt',
            content: <StudentSupportRequests {...props} />,
        },
    ];
}
