import { studentCourseUrls } from '@/components/StudentCourses/StudentCourses.routes';
import type { TabItem } from '@/components/Navigation/Tabs/Tabs';
import {
    TableListCreateButton,
    TableListRowActions,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import CardBox from '@/components/UI/CardBox/CardBox';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import RichTextContent from '@/components/UI/RichTextContent/RichTextContent';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { dateLabel } from '@/utils/formatters';
import DeleteStudentRecord from '../DeleteStudentRecord';
import StudentRecordTable from '../StudentRecordTable';
import type { Permissions, StudentOptions, StudentRecord } from '../Students.types';
import StudentRecordFilters, {
    matchesStudentRecordFilter,
    useStudentRecordFilters,
} from './StudentRecordFilters';
import '@styles/components/Students/Details/StudentDetails.css';

type StudentCourse = NonNullable<StudentRecord['student_courses']>[number];

type StudentPersonalRecordProps = StudentOptions & {
    student: StudentRecord;
    academicLoading?: boolean;
};

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
        <CardBox className="studentDetails__recordDetailsCard">
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
        </CardBox>
    );
}

function AcademicDetails({
    student,
    permissions,
    academicLoading,
}: StudentPersonalRecordProps): React.JSX.Element {
    const courses = student.student_courses ?? [];
    const filters = useStudentRecordFilters(['course', 'year', 'status'] as const);
    const filteredCourses = courses.filter(
        (relation) =>
            matchesStudentRecordFilter(relation.course?.name, filters.values.course) &&
            matchesStudentRecordFilter(relation.academic_year, filters.values.year) &&
            (!filters.values.status ||
                filters.values.status === (relation.is_current ? 'current' : 'history')),
    );
    const createAction = permissions['student-course.create'] ? (
        <TableListCreateButton
            href={studentCourseUrls.create(student.id)}
            ariaLabel="Cadastrar curso do aluno"
        />
    ) : undefined;

    return (
        <StudentRecordTable
            ariaLabel="Cursos do aluno"
            columns={courseColumns(permissions)}
            rows={filteredCourses}
            rowKey={(relation) => relation.id}
            emptyMessage="Nenhum curso do aluno encontrado."
            actions={createAction}
            loading={academicLoading}
            filters={
                <StudentRecordFilters
                    idPrefix="student-course-filter"
                    label="Filtrar vínculos com cursos"
                    fields={[
                        { name: 'course', label: 'Curso / Série' },
                        { name: 'year', label: 'Ano letivo' },
                        {
                            name: 'status',
                            label: 'Situação',
                            options: [
                                { value: 'current', label: 'Atual' },
                                { value: 'history', label: 'Histórico' },
                            ],
                        },
                    ]}
                    values={filters.values}
                    onChange={filters.update}
                    onClear={filters.clear}
                />
            }
        />
    );
}

/** Abas "Dados pessoais" e "Cursos do aluno". */
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
            label: 'Cursos do aluno',
            icon: 'fa fa-graduation-cap',
            content: <AcademicDetails {...props} />,
        },
    ];
}
