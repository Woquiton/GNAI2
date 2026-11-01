import type { TableListColumn } from '@/components/Tables/TableList/TableList';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import type { AuditRecord } from '../Audit.types';
import { auditDateTime, auditEventTone } from '../Audit.utils';

/** Colunas de dados do histórico de alterações. */
export const auditColumns: TableListColumn<AuditRecord>[] = [
    {
        id: 'entity',
        label: 'Registro',
        width: '30%',
        fixed: 'start',
        render: (record) => <span title={record.plain.summary}>{record.plain.summary}</span>,
    },
    {
        id: 'event',
        label: 'Ação',
        width: '12%',
        render: (record) => (
            <TableLabel tone={auditEventTone(record.event)}>{record.plain.event}</TableLabel>
        ),
    },
    { id: 'type', label: 'Tipo', width: '16%', render: (record) => record.plain.type },
    { id: 'author', label: 'Quem fez', width: '18%', render: (record) => record.plain.author },
    {
        id: 'date',
        label: 'Quando',
        width: '14%',
        render: (record) => (
            <time dateTime={record.date ?? undefined}>{auditDateTime(record.date)}</time>
        ),
    },
];
