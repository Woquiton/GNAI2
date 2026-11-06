import type { TableListColumn } from '@/components/Tables/TableList/TableList';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { supportRequestStatusTones } from '../SupportRequests.constants';
import type { SupportRequestSummary } from '../SupportRequests.types';

export const supportRequestColumns: TableListColumn<SupportRequestSummary>[] = [
    {
        id: 'student',
        label: 'Aluno',
        width: '24%',
        fixed: 'start',
        render: (record) => record.student_name,
    },
    { id: 'protocol', label: 'Protocolo', width: '10%', render: (record) => `#${record.id}` },
    {
        id: 'date',
        label: 'Solicitação',
        width: '15%',
        render: (record) => record.request_date_label,
    },
    {
        id: 'requester',
        label: 'Solicitante',
        width: '20%',
        render: (record) => record.requester_name,
    },
    {
        id: 'status',
        label: 'Situação',
        width: '15%',
        render: (record) => (
            <TableLabel tone={supportRequestStatusTones[record.status]}>
                {record.status_label}
            </TableLabel>
        ),
    },
    {
        id: 'registration',
        label: 'Matrícula',
        width: '15%',
        defaultVisible: false,
        render: (record) => record.registration,
    },
    {
        id: 'role',
        label: 'Vínculo do solicitante',
        width: '18%',
        defaultVisible: false,
        render: (record) => record.requester_role_label,
    },
    {
        id: 'creator',
        label: 'Registrada por',
        width: '18%',
        defaultVisible: false,
        render: (record) => record.created_by_name,
    },
    {
        id: 'updated',
        label: 'Última atualização',
        width: '18%',
        defaultVisible: false,
        render: (record) => record.updated_at_label,
    },
];
