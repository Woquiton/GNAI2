import type { ReactNode } from 'react';
import FormSection from '@/components/Forms/FormSection/FormSection';
import type { TabItem } from '@/components/Navigation/Tabs/Tabs';
import TableActions from '@/components/Tables/TableActions/TableActions';
import {
  TableListCreateButton,
  type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import DeleteStudentRecord from './DeleteStudentRecord';
import StudentRecordFilters, {
  matchesStudentRecordFilter,
  useStudentRecordFilters,
} from './StudentRecordFilters';
import StudentRecordTable from './StudentRecordTable';
import type { StudentOptions, StudentRecord } from './Students.types';
import { aeeBase, dateLabel } from './Students.utils';

const courseColumns: TableListColumn[] = [
  {
    id: 'course',
    label: 'Curso / Série',
    width: '34%',
    minWidth: 140,
    fixed: 'start',
  },
  { id: 'year', label: 'Ano letivo', width: '14%', minWidth: 80 },
  { id: 'semester', label: 'Semestre', width: '16%', minWidth: 90 },
  { id: 'status', label: 'Situação', width: '14%', minWidth: 90 },
  {
    id: 'actions',
    label: 'Ações',
    width: '22%',
    minWidth: 104,
    fixed: 'end',
  },
];

type StudentPersonalRecordProps = StudentOptions & {
  student: StudentRecord;
  profileNames: string[];
  academicLoading?: boolean;
};

function Detail({
  label,
  children,
  wide = false,
}: {
  label: string;
  children: ReactNode;
  wide?: boolean;
}): React.JSX.Element {
  return (
    <div
      className={wide
        ? 'studentsPage__detail studentsPage__detail--wide'
        : 'studentsPage__detail'}
    >
      <dt>{label}:</dt>
      <dd>{children}</dd>
    </div>
  );
}

function PersonalDetails({
  student,
}: {
  student: StudentRecord;
}): React.JSX.Element {
  const person = student.person;

  return (
    <CardBox className="studentsPage__recordDetailsCard">
      <FormSection
        id="dados-identificacao"
        title="Identificação"
        iconClass="fa fa-user"
        variant="inline"
      >
        <dl className="studentsPage__detailGrid">
          <Detail label="Nome completo">{person.name}</Detail>
          <Detail label="Gênero">{person.gender_label || '---'}</Detail>
          <Detail label="CPF">{person.document || '---'}</Detail>
          <Detail label="Nascimento">{dateLabel(person.birth_date)}</Detail>
          <Detail label="Idade">
            {person.age != null ? `${person.age} anos` : '---'}
          </Detail>
        </dl>
      </FormSection>
      <FormSection
        id="dados-contato"
        title="Contato e Endereço"
        iconClass="fa fa-map-marker"
        variant="inline"
      >
        <dl className="studentsPage__detailGrid">
          <Detail label="E-mail">{person.email || '---'}</Detail>
          <Detail label="Telefone">{person.phone || '---'}</Detail>
          <Detail label="Endereço" wide>
            {person.address_html ? (
              <div
                className="studentsPage__richText"
                dangerouslySetInnerHTML={{ __html: person.address_html }}
              />
            ) : '---'}
          </Detail>
        </dl>
      </FormSection>
    </CardBox>
  );
}

function AcademicDetails({
  student,
  permissions,
  studentStatuses,
  statusColors,
  academicLoading,
}: StudentPersonalRecordProps): React.JSX.Element {
  const courses = student.student_courses ?? [];
  const filters = useStudentRecordFilters(['course', 'year', 'status'] as const);
  const filteredCourses = courses.filter((relation) => (
    matchesStudentRecordFilter(relation.course?.name, filters.values.course)
    && matchesStudentRecordFilter(relation.academic_year, filters.values.year)
    && (!filters.values.status
      || filters.values.status === (relation.is_current ? 'current' : 'history'))
  ));

  return (
    <div className="studentsPage__recordStack">
      <CardBox className="studentsPage__recordDetailsCard">
        <FormSection
          id="situacao-academica"
          title="Situação Acadêmica"
          iconClass="fa fa-graduation-cap"
          variant="inline"
        >
          <dl className="studentsPage__detailGrid">
            <Detail label="Status atual">
              <TableLabel tone={statusColors[student.status] ?? 'inverse'}>
                {studentStatuses[student.status] ?? student.status}
              </TableLabel>
            </Detail>
            <Detail label="Data de ingresso">
              {dateLabel(student.entry_date)}
            </Detail>
          </dl>
        </FormSection>
      </CardBox>
      <StudentRecordTable
        ariaLabel="Cursos do aluno"
        columns={courseColumns}
        count={filteredCourses.length}
        emptyMessage="Nenhum curso do aluno encontrado."
        loading={academicLoading}
        filters={(
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
        )}
        actions={permissions['student-course.create'] ? (
          <TableListCreateButton
            href={`${aeeBase}/student-courses/${student.id}/create`}
            ariaLabel="Cadastrar curso do aluno"
          />
        ) : undefined}
      >
        {filteredCourses.map((relation) => (
          <tr key={relation.id}>
            <td>
              <strong>
                {relation.course?.name ?? 'Curso não identificado'}
              </strong>
            </td>
            <td>{relation.academic_year}</td>
            <td>{relation.semester_label ?? 'Não informado'}</td>
            <td>
              <TableLabel tone={relation.is_current ? 'success' : 'inverse'}>
                {relation.is_current ? 'Atual' : 'Histórico'}
              </TableLabel>
            </td>
            <td>
              {permissions['student-course.view']
              || permissions['student-course.delete'] ? (
                <TableActions>
                  {permissions['student-course.view'] ? (
                    <Button
                      href={`${aeeBase}/student-courses/${relation.id}`}
                      size="sm"
                      tone="dark-blue"
                      iconOnly
                      leftIconClass="fa fa-eye"
                      aria-label={`Visualizar curso ${relation.course?.name ?? ''}`}
                    />
                  ) : null}
                  {permissions['student-course.delete'] ? (
                    <DeleteStudentRecord
                      action={`${aeeBase}/student-courses/${relation.id}`}
                      title="Excluir matrícula"
                      message="Excluir esta matrícula do histórico do aluno?"
                      ariaLabel={`Excluir matrícula no curso ${relation.course?.name ?? ''}`}
                    />
                  ) : null}
                </TableActions>
              ) : 'Nenhuma ação'}
            </td>
          </tr>
        ))}
      </StudentRecordTable>
    </div>
  );
}

export function createStudentPersonalTabs(
  props: StudentPersonalRecordProps,
): TabItem[] {
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

export default function StudentPersonalRecord({
  student,
  permissions,
  studentStatuses,
  statusColors,
  profileNames,
}: StudentPersonalRecordProps): React.JSX.Element {
  const person = student.person;
  const profileSummary = permissions['student-deficiency.view']
    ? profileNames.join(', ')
    : undefined;

  return (
    <CardBox className="studentsPage__summaryCard">
      <div className="studentsPage__summary">
        <img
          src={person.photo_url}
          alt={`Foto de ${person.name}`}
          className="studentsPage__summaryPhoto"
        />
        <div className="studentsPage__summaryBody">
          <p className="studentsPage__summaryName">{person.name}</p>
          <dl className="studentsPage__summaryDetails">
            <div className="studentsPage__summaryDetail">
              <dt>Matrícula:</dt>
              <dd>{student.registration || '---'}</dd>
            </div>
            {permissions['student-deficiency.view'] ? (
              <div className="studentsPage__summaryDetail studentsPage__summaryDetail--profile">
                <dt>Perfil de atendimento:</dt>
                <dd>{profileSummary || 'Nenhum perfil cadastrado'}</dd>
              </div>
            ) : null}
          </dl>
        </div>
        <div className="studentsPage__summaryStatus">
          <TableLabel tone={statusColors[student.status] ?? 'inverse'}>
            {studentStatuses[student.status] ?? student.status}
          </TableLabel>
        </div>
      </div>
    </CardBox>
  );
}
