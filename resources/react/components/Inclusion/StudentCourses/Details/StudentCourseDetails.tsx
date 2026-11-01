import FormSection from '@/components/Forms/FormSection/FormSection';
import { formatTableListText } from '@/components/Tables/TableList/TableList';
import CardBox from '@/components/UI/CardBox/CardBox';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import RichTextContent from '@/components/UI/RichTextContent/RichTextContent';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import TagList from '@/components/UI/TagList/TagList';
import { dateTimeLabel } from '@/utils/formatters';
import { sortDisciplines } from '../StudentCourses.constants';
import type { StudentCourseShowDisplay, StudentCourseShowRecord } from '../StudentCourses.types';

interface StudentCourseDetailsProps {
    studentCourse: StudentCourseShowRecord;
    studentName: string;
    courseName: string;
    display: StudentCourseShowDisplay;
}

/** Dados da matrícula, acompanhamento acadêmico, matriz curricular e informações do sistema. */
export default function StudentCourseDetails({
    studentCourse,
    studentName,
    courseName,
    display,
}: StudentCourseDetailsProps): React.JSX.Element {
    const curriculum = sortDisciplines(studentCourse.course?.disciplines).map((discipline) => ({
        id: discipline.id,
        // A descrição da disciplina é texto rico: o `title` recebe somente o texto, sem marcação.
        name: (
            <span
                title={
                    discipline.description
                        ? formatTableListText(discipline.description)
                        : undefined
                }
            >
                {discipline.name}
            </span>
        ),
    }));

    return (
        <CardBox>
            <FormSection
                id="student-course-data"
                title="Dados da Matrícula"
                variant="inline"
                iconClass="fa fa-graduation-cap"
            >
                <DetailGrid>
                    <DetailField label="Aluno">
                        <strong>{studentName || '---'}</strong>
                    </DetailField>
                    <DetailField label="Curso / Série">{courseName}</DetailField>
                    <DetailField label="Ano Letivo">
                        {studentCourse.academic_year ?? '---'}
                    </DetailField>
                    <DetailField label="Semestre">
                        {studentCourse.semester?.label ?? 'Não informado'}
                    </DetailField>
                    <DetailField label="Situação">
                        <TableLabel tone={studentCourse.is_current ? 'success' : 'inverse'}>
                            {studentCourse.is_current ? 'Atual' : 'Histórico'}
                        </TableLabel>
                    </DetailField>
                    <DetailField label="Descrição do Curso" wide>
                        <RichTextContent html={display.courseDescriptionHtml} />
                    </DetailField>
                </DetailGrid>
            </FormSection>
            <FormSection
                id="student-course-follow-up"
                title="Acompanhamento Acadêmico no Curso"
                variant="inline"
                iconClass="fa fa-line-chart"
            >
                <DetailGrid>
                    <DetailField label="Situação da Frequência Escolar" wide>
                        <RichTextContent html={display.schoolAttendanceStatusHtml} />
                    </DetailField>
                    <DetailField label="Disciplinas com Reprovação">
                        <TagList
                            items={studentCourse.failed_disciplines ?? []}
                            emptyMessage="Nenhuma."
                        />
                    </DetailField>
                    <DetailField label="Disciplinas com Risco de Insucesso Acadêmico">
                        <TagList
                            items={studentCourse.at_risk_disciplines ?? []}
                            emptyMessage="Nenhuma."
                        />
                    </DetailField>
                </DetailGrid>
            </FormSection>
            <FormSection
                id="student-course-curriculum"
                title="Matriz Curricular"
                variant="inline"
                iconClass="fa fa-book"
            >
                <TagList items={curriculum} emptyMessage="Nenhuma disciplina vinculada ao curso." />
            </FormSection>
            <FormSection
                id="student-course-system"
                title="Informações do Sistema"
                variant="inline"
                iconClass="fa fa-info-circle"
            >
                <DetailGrid>
                    <DetailField label="Criado em">
                        {dateTimeLabel(studentCourse.created_at)}
                    </DetailField>
                    <DetailField label="Atualizado em">
                        {dateTimeLabel(studentCourse.updated_at)}
                    </DetailField>
                </DetailGrid>
            </FormSection>
        </CardBox>
    );
}
