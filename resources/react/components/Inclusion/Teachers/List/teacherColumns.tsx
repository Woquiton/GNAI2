import {
    formatTableListDate,
    TableListPersonCell,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import { NOT_INFORMED } from '../Teachers.constants';
import type { TeacherRecord } from '../Teachers.types';

/** Colunas de dados; telefone, CPF e nascimento começam ocultas no seletor de colunas. */
export const teacherColumns: TableListColumn<TeacherRecord>[] = [
    {
        id: 'name',
        label: 'Nome',
        width: '38%',
        fixed: 'start',
        render: ({ person }) => (
            <TableListPersonCell name={person.name} photoUrl={person.photo_url} />
        ),
    },
    {
        id: 'email',
        label: 'E-mail',
        width: '30%',
        render: (teacher) => teacher.person.email || NOT_INFORMED,
    },
    {
        id: 'registration',
        label: 'Matrícula',
        width: '18%',
        render: (teacher) => teacher.registration || NOT_INFORMED,
    },
    {
        id: 'phone',
        label: 'Telefone',
        width: '16%',
        defaultVisible: false,
        render: (teacher) => teacher.person.phone || NOT_INFORMED,
    },
    {
        id: 'document',
        label: 'CPF',
        width: '16%',
        defaultVisible: false,
        render: (teacher) => teacher.person.document || NOT_INFORMED,
    },
    {
        id: 'birth',
        label: 'Nascimento',
        width: '16%',
        defaultVisible: false,
        render: (teacher) => formatTableListDate(teacher.person.birth_date),
    },
];
