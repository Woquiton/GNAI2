import type { TableListColumn } from '@/components/Tables/TableList/TableList';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { dateLabel } from '@/utils/formatters';
import type { CaseStudyRow } from '../CaseStudies.types';

const semester = (caseStudy: CaseStudyRow) => caseStudy.semester_label || 'Não informado';
const version = (caseStudy: CaseStudyRow) => `v${caseStudy.version}`;
const status = (caseStudy: CaseStudyRow) => (
    <TableLabel tone={caseStudy.status_tone}>{caseStudy.status_label}</TableLabel>
);
const created = (caseStudy: CaseStudyRow) => dateLabel(caseStudy.created_at);

/** Colunas de dados da listagem geral, iniciada pelo aluno. */
export const caseStudyColumns: TableListColumn<CaseStudyRow>[] = [
    {
        id: 'student',
        label: 'Aluno',
        width: '30%',
        fixed: 'start',
        render: (caseStudy) => caseStudy.student?.name || 'Não informado',
    },
    { id: 'semester', label: 'Semestre', width: '16%', render: semester },
    { id: 'version', label: 'Versão', width: '10%', render: version },
    { id: 'status', label: 'Status', width: '15%', render: status },
    { id: 'created', label: 'Criado em', width: '13%', render: created },
];

/** Colunas de dados da listagem do aluno, iniciada pelo semestre. */
export const studentCaseStudyColumns: TableListColumn<CaseStudyRow>[] = [
    { id: 'semester', label: 'Semestre', width: '26%', fixed: 'start', render: semester },
    { id: 'version', label: 'Versão', width: '14%', render: version },
    { id: 'status', label: 'Status', width: '20%', render: status },
    { id: 'created', label: 'Criado em', width: '20%', render: created },
];

/** Colunas de dados do histórico completo do aluno, iniciado pela versão. */
export const caseStudyHistoryColumns: TableListColumn<CaseStudyRow>[] = [
    { id: 'version', label: 'Versão', width: '16%', fixed: 'start', render: version },
    { id: 'semester', label: 'Semestre', width: '26%', render: semester },
    { id: 'status', label: 'Status', width: '22%', render: status },
    { id: 'created', label: 'Criado em', width: '20%', render: created },
];
