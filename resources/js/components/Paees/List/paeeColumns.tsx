import type { TableListColumn } from '@/components/Tables/TableList/TableList';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { dateLabel } from '@/utils/formatters';
import { paeeStatusTone, paeeVersionLabel } from '../Paees.constants';
import type { PaeeListRecord } from '../Paees.types';

const NOT_INFORMED = 'Não informado';

type PaeeColumn = TableListColumn<PaeeListRecord>;

const semester = (paee: PaeeListRecord) => paee.semester_label || NOT_INFORMED;
const version = (paee: PaeeListRecord) => paeeVersionLabel(paee.version);
const nextReview = (paee: PaeeListRecord) => dateLabel(paee.next_review_date);

function status(paee: PaeeListRecord): React.JSX.Element {
    return <TableLabel tone={paeeStatusTone(paee.status)}>{paee.status_label}</TableLabel>;
}

/** Listagem geral: o aluno abre a tabela. */
export const paeeAllColumns: PaeeColumn[] = [
    {
        id: 'student',
        label: 'Aluno',
        width: '30%',
        fixed: 'start',
        render: (paee) => paee.student?.name || NOT_INFORMED,
    },
    { id: 'semester', label: 'Semestre', width: '16%', render: semester },
    { id: 'version', label: 'Versão', width: '10%', render: version },
    { id: 'status', label: 'Status', width: '14%', render: status },
    { id: 'next_review', label: 'Próxima revisão', width: '16%', render: nextReview },
];
