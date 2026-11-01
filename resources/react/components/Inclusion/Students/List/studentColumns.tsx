import PersonIdentity from '@/components/Inclusion/People/PersonIdentity';
import { formatTableListDate, type TableListColumn } from '@/components/Tables/TableList/TableList';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { dateLabel } from '@/utils/formatters';
import type { Student, StudentOptions } from '../Students.types';

const NOT_INFORMED = 'Não informado';

/** Colunas da listagem; as complementares começam ocultas no seletor de colunas. */
export function studentColumns({
    studentStatuses,
    statusColors,
}: Pick<StudentOptions, 'studentStatuses' | 'statusColors'>): TableListColumn<Student>[] {
    return [
        {
            id: 'name',
            label: 'Nome',
            width: '25%',
            fixed: 'start',
            render: (student) => (
                <PersonIdentity name={student.person.name} photoUrl={student.person.photo_url} />
            ),
        },
        {
            id: 'phone',
            label: 'Telefone',
            width: '15%',
            render: (student) => student.person.phone || NOT_INFORMED,
        },
        {
            id: 'email',
            label: 'E-mail',
            width: '25%',
            render: (student) => student.person.email || NOT_INFORMED,
        },
        {
            id: 'status',
            label: 'Status',
            width: '10%',
            render: (student) => (
                <TableLabel tone={statusColors[student.status] ?? 'inverse'}>
                    {studentStatuses[student.status] ?? student.status}
                </TableLabel>
            ),
        },
        {
            id: 'entry',
            label: 'Ingresso',
            width: '10%',
            render: (student) => dateLabel(student.entry_date),
        },
        {
            id: 'registration',
            label: 'Matrícula',
            width: '16%',
            defaultVisible: false,
            render: (student) => student.registration || NOT_INFORMED,
        },
        {
            id: 'document',
            label: 'CPF',
            width: '16%',
            defaultVisible: false,
            render: (student) => student.person.document || NOT_INFORMED,
        },
        {
            id: 'birth',
            label: 'Nascimento',
            width: '16%',
            defaultVisible: false,
            render: (student) => formatTableListDate(student.person.birth_date),
        },
        {
            id: 'age',
            label: 'Idade',
            width: '16%',
            defaultVisible: false,
            render: (student) => student.person.age ?? NOT_INFORMED,
        },
        {
            id: 'gender',
            label: 'Gênero',
            width: '16%',
            defaultVisible: false,
            render: (student) => student.person.gender_label || NOT_INFORMED,
        },
    ];
}
