import FormSection from '@/components/Forms/FormSection/FormSection';
import DeleteStudentRecord from '@/components/Inclusion/Students/DeleteStudentRecord';
import StudentRecordTable from '@/components/Inclusion/Students/StudentRecordTable';
import TableActions from '@/components/Tables/TableActions/TableActions';
import {
    TableListCreateButton,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import Button from '@/components/UI/Button/Button';
import { dateLabel } from '@/utils/formatters';
import { NOT_INFORMED } from '../Peis.constants';
import { peiDisciplineUrls } from '../Peis.routes';
import type { PeiDisciplineSummary } from '../Peis.types';
import { PEI_TOUR_TARGETS } from '../peiTours';

const columns: TableListColumn[] = [
    {
        id: 'discipline',
        label: 'Disciplina',
        width: '32%',
        fixed: 'start',
    },
    { id: 'teacher', label: 'Professor responsável', width: '28%' },
    { id: 'created', label: 'Cadastrada em', width: '16%' },
    {
        id: 'actions',
        label: 'Ações',
        width: '24%',
        fixed: 'end',
    },
];

interface PeiDisciplineTableProps {
    peiId: number;
    disciplines: PeiDisciplineSummary[] | null;
    canView: boolean;
    canCreate: boolean;
    canPdf: boolean;
}

interface PeiDisciplineRowProps {
    peiId: number;
    item: PeiDisciplineSummary;
    canPdf: boolean;
}

function PeiDisciplineRow({ peiId, item, canPdf }: PeiDisciplineRowProps): React.JSX.Element {
    const name = item.discipline_name || 'disciplina não identificada';

    return (
        <tr>
            <td>
                <strong>{item.discipline_name || NOT_INFORMED}</strong>
            </td>
            <td>{item.teacher_name || NOT_INFORMED}</td>
            <td>{dateLabel(item.created_at)}</td>
            <td>
                <TableActions>
                    <Button
                        href={peiDisciplineUrls.show(peiId, item.id)}
                        size="sm"
                        tone="dark-blue"
                        iconOnly
                        leftIconClass="fa fa-eye"
                        aria-label={`Visualizar adaptação de ${name}`}
                    />
                    {canPdf ? (
                        <Button
                            href={peiDisciplineUrls.pdf(peiId, item.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="sm"
                            tone="dark-red"
                            iconOnly
                            leftIconClass="fa fa-file-pdf-o"
                            aria-label={`Gerar PDF da adaptação de ${name}`}
                        />
                    ) : null}
                    {item.can_update ? (
                        <Button
                            href={peiDisciplineUrls.edit(peiId, item.id)}
                            size="sm"
                            tone="warning"
                            iconOnly
                            leftIconClass="fa fa-pencil"
                            aria-label={`Editar adaptação de ${name}`}
                        />
                    ) : null}
                    {item.can_delete ? (
                        <DeleteStudentRecord
                            action={peiDisciplineUrls.destroy(peiId, item.id)}
                            title="Excluir Adaptação"
                            message="Deseja realmente excluir esta adaptação?"
                            ariaLabel={`Excluir adaptação de ${name}`}
                        />
                    ) : null}
                </TableActions>
            </td>
        </tr>
    );
}

/** Aba de adaptações curriculares do PEI: tabela completa com cadastro acima. */
export default function PeiDisciplineTable({
    peiId,
    disciplines,
    canView,
    canCreate,
    canPdf,
}: PeiDisciplineTableProps): React.JSX.Element {
    const items = disciplines ?? [];
    const createButton = canCreate ? (
        <TableListCreateButton
            href={peiDisciplineUrls.create(peiId)}
            ariaLabel="Cadastrar adaptação curricular"
        />
    ) : undefined;
    const createOnly = createButton ? (
        <div className="studentsPage__recordListActions">{createButton}</div>
    ) : null;

    return (
        <FormSection
            id="pei-disciplines"
            tourTarget={PEI_TOUR_TARGETS.disciplines}
            title="Adaptações Razoáveis e/ou Acessibilidades Curriculares"
            iconClass="fa fa-book"
            variant="inline"
        >
            {canView ? (
                <StudentRecordTable
                    ariaLabel="Adaptações curriculares do PEI"
                    columns={columns}
                    count={items.length}
                    emptyMessage="Nenhuma adaptação razoável e/ou acessibilidade curricular cadastrada."
                    actions={createButton}
                >
                    {items.map((item) => (
                        <PeiDisciplineRow key={item.id} peiId={peiId} item={item} canPdf={canPdf} />
                    ))}
                </StudentRecordTable>
            ) : (
                createOnly
            )}
        </FormSection>
    );
}
