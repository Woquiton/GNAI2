import type { TableListColumn } from '@/components/Tables/TableList/TableList';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { dateLabel } from '@/utils/formatters';
import type { AeeListRecord } from '../AeeRecords.types';
import './AeeRecordList.css';

/** Curso atual de cada aluno avaliado, um por linha, na ordem das avaliações. */
function CourseCell({ record }: { record: AeeListRecord }): React.JSX.Element {
    const evaluations = record.student_evaluations ?? [];

    if (!evaluations.length) {
        return <span className="aeeRecordList__muted">Sem curso</span>;
    }

    return (
        <span className="aeeRecordList__stack">
            {evaluations.map((evaluation) => {
                const course = evaluation.student?.current_course?.course;

                return (
                    <span
                        key={evaluation.id}
                        className={course ? undefined : 'aeeRecordList__muted'}
                    >
                        {course?.name ?? 'Sem curso'}
                    </span>
                );
            })}
        </span>
    );
}

/** Alunos avaliados com a respectiva presença. */
function StudentsCell({ record }: { record: AeeListRecord }): React.JSX.Element {
    const evaluations = record.student_evaluations ?? [];

    if (!evaluations.length) {
        return <span className="aeeRecordList__muted">Nenhum estudante avaliado</span>;
    }

    return (
        <span className="aeeRecordList__stack">
            {evaluations.map((evaluation) => (
                <span key={evaluation.id} className="aeeRecordList__student">
                    <span className="aeeRecordList__name">
                        {evaluation.student?.person?.name ?? 'Estudante não informado'}
                    </span>
                    <TableLabel tone={evaluation.is_present ? 'success' : 'danger'}>
                        {evaluation.is_present ? 'Presente' : 'Ausente'}
                    </TableLabel>
                </span>
            ))}
        </span>
    );
}

/** Colunas de dados das listagens gerais; a coluna de ações é acrescentada pela tabela. */
export const aeeRecordColumns: TableListColumn<AeeListRecord>[] = [
    {
        id: 'date',
        label: 'Data',
        width: '13%',
        fixed: 'start',
        render: (record) => dateLabel(record.attendance_session?.session_date),
    },
    {
        id: 'course',
        label: 'Curso',
        width: '22%',
        render: (record) => <CourseCell record={record} />,
    },
    {
        id: 'students',
        label: 'Estudantes',
        width: '30%',
        render: (record) => <StudentsCell record={record} />,
    },
    {
        id: 'professional',
        label: 'Profissional responsável',
        width: '22%',
        render: (record) =>
            record.attendance_session?.professional?.person?.name ?? 'Não informado',
    },
];
