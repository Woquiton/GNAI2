import FormSection from '@/components/Forms/FormSection/FormSection';
import {
    studentCourseUrls,
} from '@/components/Inclusion/StudentCourses/StudentCourses.routes';
import type { TabItem } from '@/components/Navigation/Tabs/Tabs';
import {
    TableListCreateButton,
    TableListRowActions,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import RichTextContent from '@/components/UI/RichTextContent/RichTextContent';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { dateLabel } from '@/utils/formatters';
import DeleteStudentRecord from '../DeleteStudentRecord';
import StudentRecordTable from '../StudentRecordTable';
import type { Permissions, StudentOptions, StudentRecord } from '../Students.types';
import './StudentDetails.css';

type StudentCourse = StudentRecord['student_courses'][number];

type StudentPersonalRecordProps = StudentOptions & { student: StudentRecord };


function courseColumns(permissions: Permissions): TableListColumn<StudentCourse>[] {
    return [
        {
            id: 'course',
            label: 'Curso / Série',
            width: '34%',
            fixed: 'start',
            render: (relation) => (
                <strong>{relation.course?.name ?? 'Curso não identificado'}</strong>
            ),
        },
        {
            id: 'year',
            label: 'Ano letivo',
            width: '14%',
            render: (relation) => relation.academic_year,
        },
        {
            id: 'semester',
            label: 'Semestre',
            width: '16%',
            render: (relation) => relation.semester_label ?? 'Não informado',
        },
        {
            id: 'status',
            label: 'Situação',
            width: '14%',
            render: (relation) => (
                <TableLabel tone={relation.is_current ? 'success' : 'inverse'}>
                    {relation.is_current ? 'Atual' : 'Histórico'}
                </TableLabel>
            ),
        },
        {
            id: 'actions',
            label: 'Ações',
            width: '22%',
            fixed: 'end',
            render: (relation) => (
                <TableListRowActions
                    view={
                        permissions['student-course.view'] && {
                            href: studentCourseUrls.show(relation.id),
                            label: `Visualizar curso ${relation.course?.name ?? ''}`,
                        }
                    }
                >
                    {permissions['student-course.delete'] ? (
                        <DeleteStudentRecord
                            action={studentCourseUrls.destroy(relation.id)}
                            title="Excluir matrícula"
                            message="Excluir esta matrícula do histórico do aluno?"
                            ariaLabel={`Excluir matrícula no curso ${relation.course?.name ?? ''}`}
                        />
                    ) : null}
                </TableListRowActions>
            ),
        },
    ];
}

function PersonalDetails({ student }: { student: StudentRecord }): React.JSX.Element {
    const person = student.person;
    const age = person.age != null ? `${person.age} anos` : '---';
    const address = person.address_html ? <RichTextContent html={person.address_html} /> : '---';

    return (
        <FormSection
            id="dados-gerais"
            title="Dados Pessoais"
            iconClass="fa fa-user"
            variant="inline"
        >
            <DetailGrid>
                <DetailField label="Nome completo">{person.name}</DetailField>
                <DetailField label="Gênero">{person.gender_label || '---'}</DetailField>
                <DetailField label="CPF">{person.document || '---'}</DetailField>
                <DetailField label="Nascimento">{dateLabel(person.birth_date)}</DetailField>
                <DetailField label="Idade">{age}</DetailField>
                <DetailField label="E-mail">{person.email || '---'}</DetailField>
                <DetailField label="Telefone">{person.phone || '---'}</DetailField>
                <DetailField label="Endereço" wide>
                    {address}
                </DetailField>
            </DetailGrid>
        </FormSection>
    );
}

function AcademicDetails({
    student,
    permissions,
    studentStatuses,
    statusColors,
}: StudentPersonalRecordProps): React.JSX.Element {
    const createAction = permissions['student-course.create'] ? (
        <TableListCreateButton
            href={studentCourseUrls.create(student.id)}
            ariaLabel="Cadastrar curso do aluno"
        />
    ) : undefined;

    return (
        <FormSection
            id="informacoes-escolares"
            title="Informações Acadêmicas"
            iconClass="fa fa-graduation-cap"
            variant="inline"
        >
            <DetailGrid>
                <DetailField label="Status atual">
                    <TableLabel tone={statusColors[student.status] ?? 'inverse'}>
                        {studentStatuses[student.status] ?? student.status}
                    </TableLabel>
                </DetailField>
                <DetailField label="Data de ingresso">{dateLabel(student.entry_date)}</DetailField>
            </DetailGrid>
            <h3 className="studentDetails__subheading">Vínculo com cursos</h3>
            <StudentRecordTable
                ariaLabel="Cursos do aluno"
                columns={courseColumns(permissions)}
                rows={student.student_courses}
                rowKey={(relation) => relation.id}
                emptyMessage="Nenhum curso do aluno encontrado."
                actions={createAction}
            />
        </FormSection>
    );
}

/** Abas "Dados pessoais" e "Informações acadêmicas" (com o vínculo de cursos). */
export function createStudentPersonalTabs(props: StudentPersonalRecordProps): TabItem[] {
    return [
        {
            id: 'personal-data',
            label: 'Dados pessoais',
            icon: 'fa fa-user',
            content: <PersonalDetails student={props.student} />,
        },
        {
            id: 'academic-data',
            label: 'Informações acadêmicas',
            accessibleLabel: 'Informações acadêmicas do aluno',
            icon: 'fa fa-graduation-cap',
            content: <AcademicDetails {...props} />,
        },
    ];
}
