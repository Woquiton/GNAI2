import FormSection from '@/components/Forms/FormSection/FormSection';
import { coursePeriodLabel } from '@/components/Inclusion/coursePeriods';
import {
    TableListScroll,
    TableListTable,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import CardBox from '@/components/UI/CardBox/CardBox';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import RichTextContent from '@/components/UI/RichTextContent/RichTextContent';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { COURSE_TOUR_TARGETS } from '../courseTours';
import type { CourseCurriculumDiscipline, CourseRecord } from '../Courses.types';

const disciplineColumns: TableListColumn<CourseCurriculumDiscipline>[] = [
    {
        id: 'name',
        label: 'Disciplina',
        width: '55%',
        fixed: 'start',
        render: (discipline) => discipline.name,
    },
    {
        id: 'period',
        label: 'Período',
        width: '20%',
        render: (discipline) => coursePeriodLabel(discipline.pivot?.course_period),
    },
    {
        id: 'type',
        label: 'Tipo',
        width: '25%',
        fixed: 'end',
        render: () => <TableLabel tone="purple">Obrigatória</TableLabel>,
    },
];

function disciplineCount(total: number): string {
    return `${total} ${total === 1 ? 'disciplina' : 'disciplinas'}`;
}

/** Informações gerais e matriz curricular de um curso. */
interface CourseDetailsProps {
    course: CourseRecord;
    /** Descrição sanitizada no servidor. */
    descriptionHtml: string;
}

export default function CourseDetails({
    course,
    descriptionHtml,
}: CourseDetailsProps): React.JSX.Element {
    // Ordem da matriz: por período e, dentro dele, por nome; disciplinas sem período ficam no fim.
    const disciplines = [...(course.disciplines ?? [])].sort(
        (first, second) =>
            (first.pivot?.course_period ?? Number.MAX_SAFE_INTEGER) -
                (second.pivot?.course_period ?? Number.MAX_SAFE_INTEGER) ||
            first.name.localeCompare(second.name, 'pt-BR'),
    );

    return (
        <CardBox>
            <FormSection
                id="course-show-general"
                title="Identificação"
                variant="inline"
                iconClass="fa fa-graduation-cap"
                tourTarget={COURSE_TOUR_TARGETS.detailsGeneral}
            >
                <DetailGrid>
                    <DetailField label="Nome do Curso">{course.name}</DetailField>
                    <DetailField label="Status">
                        <TableLabel tone={course.is_active ? 'success' : 'danger'}>
                            {course.is_active ? 'Ativo' : 'Inativo'}
                        </TableLabel>
                    </DetailField>
                    <DetailField label="Descrição / Observações" wide>
                        <RichTextContent html={descriptionHtml} />
                    </DetailField>
                </DetailGrid>
            </FormSection>
            <FormSection
                id="course-show-curriculum"
                title="Matriz Curricular (Disciplinas)"
                variant="inline"
                iconClass="fa fa-book"
                tourTarget={COURSE_TOUR_TARGETS.detailsCurriculum}
            >
                <TableListScroll aria-label="Disciplinas da matriz curricular">
                    <TableListTable
                        columns={disciplineColumns}
                        rows={disciplines}
                        rowKey={(discipline) => discipline.id}
                        summary={disciplineCount(disciplines.length)}
                        emptyMessage="Nenhuma disciplina vinculada a este curso."
                    />
                </TableListScroll>
            </FormSection>
        </CardBox>
    );
}
