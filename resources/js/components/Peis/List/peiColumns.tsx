import type { TableListColumn } from '@/components/Tables/TableList/TableList';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { dateLabel } from '@/utils/formatters';
import { NOT_INFORMED, peiVersionLabel } from '../Peis.constants';
import type { PeiListRecord } from '../Peis.types';
import '@styles/components/Peis/List/PeiList.css';

interface PeiIdentityProps {
    title: string;
    meta: string;
}

/** Valor principal com uma linha secundária (matrícula ou data de criação). */
function PeiIdentity({ title, meta }: PeiIdentityProps): React.JSX.Element {
    return (
        <div className="peiList__identity">
            <span>{title}</span>
            <small className="peiList__meta">{meta}</small>
        </div>
    );
}

const courseColumn = (width: string): TableListColumn<PeiListRecord> => ({
    id: 'course',
    label: 'Curso',
    width,
    render: (pei) => pei.course?.name || 'N/A',
});

const statusColumn = (width: string): TableListColumn<PeiListRecord> => ({
    id: 'status',
    label: 'Status',
    width,
    render: (pei) => (
        <TableLabel tone={pei.is_finished ? 'success' : 'warning'}>
            {pei.is_finished ? 'Finalizado' : 'Em aberto'}
        </TableLabel>
    ),
});

const versionColumn = (width: string): TableListColumn<PeiListRecord> => ({
    id: 'version',
    label: 'Versão',
    width,
    render: peiVersionLabel,
});

/** Listagem geral: estudante, semestre, curso, status e versão. */
export const allPeiColumns: TableListColumn<PeiListRecord>[] = [
    {
        id: 'student',
        label: 'Estudante',
        width: '28%',
        fixed: 'start',
        render: (pei) => (
            <PeiIdentity
                title={pei.student?.person?.name || NOT_INFORMED}
                meta={`Matrícula: ${pei.student?.registration || NOT_INFORMED}`}
            />
        ),
    },
    {
        id: 'semester',
        label: 'Semestre',
        width: '14%',
        render: (pei) => pei.semester?.label || 'N/A',
    },
    courseColumn('22%'),
    statusColumn('12%'),
    versionColumn('10%'),
];

/** Histórico do aluno: semestre, curso, status, PEI atual e versão. */
export const studentPeiColumns: TableListColumn<PeiListRecord>[] = [
    {
        id: 'semester',
        label: 'Semestre',
        width: '24%',
        fixed: 'start',
        render: (pei) => (
            <PeiIdentity
                title={pei.semester?.label || 'N/A'}
                meta={`Criado em: ${dateLabel(pei.created_at)}`}
            />
        ),
    },
    courseColumn('26%'),
    statusColumn('13%'),
    {
        id: 'current',
        label: 'Atual',
        width: '10%',
        render: (pei) => (
            <TableLabel tone={pei.is_current ? 'success' : 'inverse'}>
                {pei.is_current ? 'Sim' : 'Não'}
            </TableLabel>
        ),
    },
    versionColumn('11%'),
];
