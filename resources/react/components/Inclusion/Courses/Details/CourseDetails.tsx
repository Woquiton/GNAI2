import FormSection from '@/components/Forms/FormSection/FormSection';
import {
    TableListScroll,
    TableListTable,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import CardBox from '@/components/UI/CardBox/CardBox';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import type { CourseDisciplineOption, CourseRecord } from '../Courses.types';

const disciplineColumns: TableListColumn<CourseDisciplineOption>[] = [
    {
        id: 'name',
        label: 'Disciplina',
        width: '75%',
        fixed: 'start',
        render: (discipline) => discipline.name,
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
export default function CourseDetails({ course }: { course: CourseRecord }): React.JSX.Element {
    const disciplines = course.disciplines ?? [];

    return (
        <CardBox>
            <FormSection
                id="course-show-general"
                title="Informações Gerais"
                variant="inline"
                iconClass="fa fa-graduation-cap"
            >
                <DetailGrid>
                    <DetailField label="Nome do Curso">
                        <strong>{course.name}</strong>
                    </DetailField>
                    <DetailField label="Status">
                        <TableLabel tone={course.is_active ? 'success' : 'danger'}>
                            {course.is_active ? 'Ativo' : 'Inativo'}
                        </TableLabel>
                    </DetailField>
                    <DetailField label="Descrição / Observações" wide preserveLineBreaks>
                        {course.description || 'Nenhuma descrição informada.'}
                    </DetailField>
                </DetailGrid>
            </FormSection>
            <FormSection
                id="course-show-curriculum"
                title="Matriz Curricular (Disciplinas)"
                variant="inline"
                iconClass="fa fa-book"
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
