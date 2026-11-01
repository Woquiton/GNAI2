import type { TableListColumn } from '@/components/Tables/TableList/TableList';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { dateLabel } from '@/utils/formatters';
import type { AeeStudentEvaluationListItem } from '../AeeRecords.types';

function PresenceLabel({ present }: { present: boolean }): React.JSX.Element {
    const iconClass = present ? 'fa fa-check-circle' : 'fa fa-times-circle';

    return (
        <TableLabel tone={present ? 'success' : 'danger'}>
            <i className={iconClass} aria-hidden="true" /> {present ? 'Presente' : 'Ausente'}
        </TableLabel>
    );
}

/** Colunas de dados da listagem do aluno; a coluna de ações é acrescentada pela tabela. */
export const studentAeeRecordColumns: TableListColumn<AeeStudentEvaluationListItem>[] = [
    {
        id: 'date',
        label: 'Data',
        width: '15%',
        fixed: 'start',
        render: (evaluation) => dateLabel(evaluation.aee_record?.attendance_session?.session_date),
    },
    {
        id: 'professional',
        label: 'Profissional',
        width: '31%',
        render: (evaluation) =>
            evaluation.aee_record?.attendance_session?.professional?.person?.name ??
            'Não informado',
    },
    {
        id: 'duration',
        label: 'Duração',
        width: '16%',
        render: (evaluation) => evaluation.aee_record?.duration || 'Não informado',
    },
    {
        id: 'presence',
        label: 'Presença',
        width: '16%',
        render: (evaluation) => <PresenceLabel present={evaluation.is_present} />,
    },
];
