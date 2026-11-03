import FormSection from '@/components/Forms/FormSection/FormSection';
import { coursePeriodLabel } from '@/components/Inclusion/coursePeriods';
import { formatTableListText } from '@/components/Tables/TableList/TableList';
import CardBox from '@/components/UI/CardBox/CardBox';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import EmptyText from '@/components/UI/EmptyText/EmptyText';
import RichTextContent from '@/components/UI/RichTextContent/RichTextContent';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import TagList from '@/components/UI/TagList/TagList';
import { dateTimeLabel } from '@/utils/formatters';
import { sortDisciplines } from '../StudentCourses.constants';
import type {
    StudentCourseAcademicHistoryEntry,
    StudentCourseShowDisplay,
    StudentCourseShowProps,
    StudentCourseShowRecord,
} from '../StudentCourses.types';

interface StudentCourseDetailsProps {
    studentCourse: StudentCourseShowRecord;
    studentName: string;
    courseName: string;
    academicHistory: StudentCourseAcademicHistoryEntry[];
    pendingDependencies: StudentCourseShowProps['pendingDependencies'];
    display: StudentCourseShowDisplay;
}

function namesOrNone(names: string[]): string {
    return names.length ? names.join(', ') : 'Nenhuma.';
}

/** Dados da matrícula, acompanhamento acadêmico, matriz curricular e informações do sistema. */
export default function StudentCourseDetails({
    studentCourse,
    studentName,
    courseName,
    academicHistory,
    pendingDependencies,
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
    const semesterRecords = studentCourse.semester_records ?? [];
    const currentPeriod = semesterRecords.find(
        (record) => record.semester_id === studentCourse.semester_id,
    );
    const dependencyItems = pendingDependencies.map((dependency) => ({
        id: dependency.discipline_id,
        name: dependency.failed_semester_label
            ? `${dependency.name} (reprovada em ${dependency.failed_semester_label})`
            : dependency.name,
    }));
    const periodHistory = semesterRecords.map((record) => ({
        id: record.id,
        name: `${record.semester?.label ?? 'Semestre'}: ${coursePeriodLabel(record.course_period)}`,
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
                    <DetailField label="Período do Curso">
                        {currentPeriod
                            ? coursePeriodLabel(currentPeriod.course_period)
                            : 'Não informado'}
                    </DetailField>
                    <DetailField label="Situação">
                        <TableLabel tone={studentCourse.is_current ? 'success' : 'inverse'}>
                            {studentCourse.is_current ? 'Atual' : 'Histórico'}
                        </TableLabel>
                    </DetailField>
                    <DetailField label="Períodos por Semestre" wide>
                        <TagList items={periodHistory} emptyMessage="Nenhum período registrado." />
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
                    <DetailField label="Dependências Pendentes" wide>
                        <TagList
                            items={dependencyItems}
                            emptyMessage="Nenhuma dependência pendente."
                        />
                    </DetailField>
                </DetailGrid>
            </FormSection>
            <FormSection
                id="student-course-academic-history"
                title="Reprovações e Riscos por Semestre"
                variant="inline"
                iconClass="fa fa-history"
            >
                {academicHistory.length ? (
                    <DetailGrid>
                        {academicHistory.map((entry) => (
                            <DetailField key={entry.semester_id} label={entry.semester_label} wide>
                                <p>
                                    <strong>Disciplinas com Reprovação:</strong>{' '}
                                    {namesOrNone(entry.failed)}
                                </p>
                                <p>
                                    <strong>Disciplinas com Risco de Insucesso Acadêmico:</strong>{' '}
                                    {namesOrNone(entry.at_risk)}
                                </p>
                                {entry.resolved.length ? (
                                    <p>
                                        <strong>Dependências aprovadas:</strong>{' '}
                                        {entry.resolved.join(', ')}
                                    </p>
                                ) : null}
                            </DetailField>
                        ))}
                    </DetailGrid>
                ) : (
                    <EmptyText>Nenhuma reprovação ou risco registrado.</EmptyText>
                )}
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
