import { formatTableListDate, type TableListColumn } from '@/components/Tables/TableList/TableList';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import type { SemesterRecord } from '../Semesters.types';

/** Colunas da listagem; início e fim começam ocultos no seletor de colunas. */
export const semesterColumns: TableListColumn<SemesterRecord>[] = [
    {
        id: 'period',
        label: 'Ano / Período',
        width: '28%',
        fixed: 'start',
        render: (semester) => (
            <span className="semesterList__period">
                <span>{semester.year}</span>
                <small>{semester.term}º Período</small>
            </span>
        ),
    },
    {
        id: 'label',
        label: 'Rótulo Identificador',
        width: '28%',
        render: (semester) => (
            <span className="semesterList__label">{semester.label || 'Não informado'}</span>
        ),
    },
    {
        id: 'status',
        label: 'Status',
        width: '22%',
        render: (semester) => (
            <TableLabel tone={semester.is_current ? 'success' : 'inverse'}>
                {semester.is_current ? 'Semestre atual' : 'Histórico'}
            </TableLabel>
        ),
    },
    {
        id: 'start',
        label: 'Início',
        width: '16%',
        defaultVisible: false,
        render: (semester) => formatTableListDate(semester.start_date),
    },
    {
        id: 'end',
        label: 'Fim',
        width: '16%',
        defaultVisible: false,
        render: (semester) => formatTableListDate(semester.end_date),
    },
];
