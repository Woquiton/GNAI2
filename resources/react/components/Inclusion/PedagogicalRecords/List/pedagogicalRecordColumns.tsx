import type { TableListColumn } from '@/components/Tables/TableList/TableList';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { dateLabel } from '@/utils/formatters';
import type { PedagogicalRecordListRow } from '../PedagogicalRecords.types';
import './PedagogicalRecordList.css';

const NOT_INFORMED = 'Não informado';

function sessionTime(record: PedagogicalRecordListRow): string {
    if (!record.start_time) {
        return NOT_INFORMED;
    }

    const start = record.start_time.slice(0, 5);
    const end = record.end_time?.slice(0, 5);

    return end ? `${start} a ${end}` : start;
}

function PresenceLabel({ record }: { record: PedagogicalRecordListRow }): React.JSX.Element {
    return (
        <TableLabel tone={record.is_present ? 'success' : 'danger'}>
            {record.is_present ? 'Presente' : 'Ausente'}
        </TableLabel>
    );
}

function GuardiansLabel({ record }: { record: PedagogicalRecordListRow }): React.JSX.Element {
    return (
        <TableLabel tone={record.has_guardians ? 'success' : 'inverse'}>
            {record.has_guardians ? 'Sim' : 'Não'}
        </TableLabel>
    );
}

/** Estudante com a presença ao lado; o nome encolhe com reticências antes da etiqueta. */
function StudentCell({ record }: { record: PedagogicalRecordListRow }): React.JSX.Element {
    return (
        <span className="pedagogicalRecordList__student">
            <span className="pedagogicalRecordList__studentName">
                {record.student_name ?? 'Estudante não informado'}
            </span>
            <PresenceLabel record={record} />
        </span>
    );
}

const dateColumn = (width: string): TableListColumn<PedagogicalRecordListRow> => ({
    id: 'date',
    label: 'Data',
    width,
    fixed: 'start',
    render: (record) => dateLabel(record.session_date),
});

/** Colunas das listagens geral e pessoal (a coluna de ações é acrescentada pela tabela). */
export const generalRecordColumns: TableListColumn<PedagogicalRecordListRow>[] = [
    dateColumn('13%'),
    {
        id: 'course',
        label: 'Curso',
        width: '19%',
        render: (record) =>
            record.course_name ?? <span className="pedagogicalRecordList__muted">Sem curso</span>,
    },
    {
        id: 'student',
        label: 'Estudante',
        width: '26%',
        render: (record) => <StudentCell record={record} />,
    },
    {
        id: 'professional',
        label: 'Profissional responsável',
        width: '20%',
        render: (record) => record.professional_name ?? NOT_INFORMED,
    },
    {
        id: 'guardians',
        label: 'Com responsáveis',
        width: '11%',
        render: (record) => <GuardiansLabel record={record} />,
    },
];

/** Colunas do histórico do aluno (a coluna de ações é acrescentada pela tabela). */
export const studentRecordColumns: TableListColumn<PedagogicalRecordListRow>[] = [
    dateColumn('13%'),
    { id: 'time', label: 'Horário', width: '13%', render: sessionTime },
    {
        id: 'professional',
        label: 'Profissional',
        width: '19%',
        render: (record) => record.professional_name ?? NOT_INFORMED,
    },
    {
        id: 'duration',
        label: 'Duração',
        width: '11%',
        render: (record) => record.duration ?? NOT_INFORMED,
    },
    {
        id: 'presence',
        label: 'Presença',
        width: '12%',
        render: (record) => <PresenceLabel record={record} />,
    },
    {
        id: 'guardians',
        label: 'Com responsáveis',
        width: '12%',
        render: (record) => <GuardiansLabel record={record} />,
    },
];
