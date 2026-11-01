import type { TabItem } from '@/components/Navigation/Tabs/Tabs';
import TableActions from '@/components/Tables/TableActions/TableActions';
import {
  TableListCreateButton,
  type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import Button from '@/components/UI/Button/Button';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import DeleteStudentRecord from './DeleteStudentRecord';
import StudentRecordFilters, {
  matchesStudentRecordFilter,
  useStudentRecordFilters,
} from './StudentRecordFilters';
import StudentRecordTable from './StudentRecordTable';
import type {
  Permissions,
  StudentCaseStudySummary,
  StudentPaeeSummary,
  StudentRecord,
  StudentRecordTabId,
} from './Students.types';
import { aeeBase, dateLabel } from './Students.utils';

interface StudentSupportRecordProps {
  student: StudentRecord;
  permissions: Permissions;
}

interface StudentSupportTabsProps extends StudentSupportRecordProps {
  caseStudies: StudentCaseStudySummary[];
  paees: StudentPaeeSummary[];
  loadingTab?: StudentRecordTabId | null;
}

const profileColumns: TableListColumn[] = [
  {
    id: 'name',
    label: 'Perfil de atendimento',
    width: '46%',
    minWidth: 140,
    fixed: 'start',
  },
  { id: 'severity', label: 'Severidade', width: '26%', minWidth: 90 },
  {
    id: 'actions',
    label: 'Ações',
    width: '28%',
    minWidth: 104,
    fixed: 'end',
  },
];

const guardianColumns: TableListColumn[] = [
  {
    id: 'guardian',
    label: 'Responsável',
    width: '28%',
    minWidth: 140,
    fixed: 'start',
  },
  { id: 'document', label: 'CPF', width: '17%', minWidth: 100 },
  { id: 'relationship', label: 'Vínculo', width: '17%', minWidth: 90 },
  { id: 'contact', label: 'Contato', width: '22%', minWidth: 120 },
  {
    id: 'actions',
    label: 'Ações',
    width: '16%',
    minWidth: 104,
    fixed: 'end',
  },
];

const caseStudyColumns: TableListColumn[] = [
  {
    id: 'version',
    label: 'Versão',
    width: '14%',
    minWidth: 72,
    fixed: 'start',
  },
  { id: 'semester', label: 'Semestre', width: '26%', minWidth: 100 },
  { id: 'status', label: 'Status', width: '22%', minWidth: 100 },
  { id: 'date', label: 'Criado em', width: '20%', minWidth: 90 },
  {
    id: 'actions',
    label: 'Ações',
    width: '18%',
    minWidth: 80,
    fixed: 'end',
  },
];

const paeeColumns: TableListColumn[] = [
  {
    id: 'version',
    label: 'Versão',
    width: '14%',
    minWidth: 72,
    fixed: 'start',
  },
  { id: 'semester', label: 'Semestre', width: '26%', minWidth: 100 },
  { id: 'status', label: 'Status', width: '22%', minWidth: 100 },
  { id: 'review', label: 'Próxima revisão', width: '20%', minWidth: 110 },
  {
    id: 'actions',
    label: 'Ações',
    width: '18%',
    minWidth: 80,
    fixed: 'end',
  },
];

const caseStudyTones: Record<string, string> = {
  completed: 'success',
  in_progress: 'warning',
};

const paeeTones: Record<string, string> = {
  active: 'success',
  under_review: 'warning',
};

function StudentProfiles({
  student,
  permissions,
  loading = false,
}: StudentSupportRecordProps & { loading?: boolean }): React.JSX.Element {
  const profiles = student.deficiencies ?? [];
  const filters = useStudentRecordFilters(['profile', 'severity'] as const);
  const filteredProfiles = profiles.filter((profile) => (
    matchesStudentRecordFilter(profile.name, filters.values.profile)
    && matchesStudentRecordFilter(profile.severity_label, filters.values.severity)
  ));
  const severityOptions = Array.from(new Set(
    profiles.map((profile) => profile.severity_label).filter(Boolean),
  )).map((label) => ({ value: label as string, label: label as string }));

  return (
    <StudentRecordTable
      ariaLabel="Perfis de atendimento do aluno"
      columns={profileColumns}
      count={filteredProfiles.length}
      emptyMessage="Nenhum perfil de atendimento do aluno encontrado."
      loading={loading}
      filters={(
        <StudentRecordFilters
          idPrefix="student-profile-filter"
          label="Filtrar perfis de atendimento"
          fields={[
            { name: 'profile', label: 'Perfil de atendimento' },
            {
              name: 'severity',
              label: 'Severidade',
              options: severityOptions,
            },
          ]}
          values={filters.values}
          onChange={filters.update}
          onClear={filters.clear}
        />
      )}
      actions={permissions['student-deficiency.create'] ? (
        <TableListCreateButton
          href={`${aeeBase}/students/${student.id}/deficiencies/create`}
          ariaLabel="Cadastrar perfil de atendimento do aluno"
        />
      ) : undefined}
    >
      {filteredProfiles.map((profile) => (
        <tr key={profile.student_deficiency_id}>
            <td><strong>{profile.name}</strong></td>
            <td>
              {profile.severity_label ? (
                <TableLabel tone={profile.severity_color ?? 'inverse'}>
                  {profile.severity_label}
                </TableLabel>
              ) : 'Não informada'}
            </td>
            <td>
              {permissions['student-deficiency.view']
              || permissions['student-deficiency.delete'] ? (
                <TableActions>
                  {permissions['student-deficiency.view'] ? (
                    <Button
                      href={`${aeeBase}/students/${student.id}/deficiencies/${profile.student_deficiency_id}`}
                      size="sm"
                      tone="dark-blue"
                      iconOnly
                      leftIconClass="fa fa-eye"
                      aria-label={`Visualizar perfil ${profile.name}`}
                    />
                  ) : null}
                  {permissions['student-deficiency.delete'] ? (
                    <DeleteStudentRecord
                      action={`${aeeBase}/students/${student.id}/deficiencies/${profile.student_deficiency_id}`}
                      title="Excluir perfil de atendimento"
                      message="Remover este perfil de atendimento do registro do aluno?"
                      ariaLabel={`Excluir perfil ${profile.name}`}
                    />
                  ) : null}
                </TableActions>
              ) : 'Nenhuma ação'}
            </td>
        </tr>
      ))}
    </StudentRecordTable>
  );
}

function StudentGuardians({
  student,
  permissions,
  loading = false,
}: StudentSupportRecordProps & { loading?: boolean }): React.JSX.Element {
  const guardians = student.guardians ?? [];
  const filters = useStudentRecordFilters(['guardian', 'relationship', 'contact'] as const);
  const filteredGuardians = guardians.filter((guardian) => (
    matchesStudentRecordFilter(
      `${guardian.person.name} ${guardian.person.document ?? ''}`,
      filters.values.guardian,
    )
    && matchesStudentRecordFilter(
      guardian.relationship_label,
      filters.values.relationship,
    )
    && matchesStudentRecordFilter(
      `${guardian.person.email ?? ''} ${guardian.person.phone ?? ''}`,
      filters.values.contact,
    )
  ));

  return (
    <StudentRecordTable
      ariaLabel="Responsáveis do aluno"
      columns={guardianColumns}
      count={filteredGuardians.length}
      emptyMessage="Nenhum responsável encontrado para este aluno."
      loading={loading}
      filters={(
        <StudentRecordFilters
          idPrefix="student-guardian-filter"
          label="Filtrar responsáveis"
          fields={[
            { name: 'guardian', label: 'Nome ou CPF' },
            { name: 'relationship', label: 'Vínculo' },
            { name: 'contact', label: 'Contato' },
          ]}
          values={filters.values}
          onChange={filters.update}
          onClear={filters.clear}
        />
      )}
      actions={permissions['guardian.create'] ? (
        <TableListCreateButton
          href={`${aeeBase}/students/${student.id}/guardians/create`}
          ariaLabel="Cadastrar responsável do aluno"
        />
      ) : undefined}
    >
      {filteredGuardians.map((guardian) => (
        <tr key={guardian.id}>
            <td>
              <div className="studentsPage__identity">
                <img
                  className="studentsPage__avatar"
                  src={guardian.person.photo_url}
                  alt={`Foto de ${guardian.person.name}`}
                />
                <strong>{guardian.person.name}</strong>
              </div>
            </td>
            <td>{guardian.person.document || 'Não informado'}</td>
            <td>{guardian.relationship_label}</td>
            <td>
              {guardian.person.email
                || guardian.person.phone
                || 'Não informado'}
            </td>
            <td>
              {permissions['guardian.view'] || permissions['guardian.delete'] ? (
                <TableActions>
                  {permissions['guardian.view'] ? (
                    <Button
                      href={`${aeeBase}/guardian/${guardian.id}/show`}
                      size="sm"
                      tone="dark-blue"
                      iconOnly
                      leftIconClass="fa fa-eye"
                      aria-label={`Visualizar responsável ${guardian.person.name}`}
                    />
                  ) : null}
                  {permissions['guardian.delete'] ? (
                    <DeleteStudentRecord
                      action={`${aeeBase}/students/${student.id}/guardians/${guardian.id}`}
                      title="Excluir responsável"
                      message={(
                        <>
                          Remover o vínculo de <strong>{guardian.person.name}</strong>?
                        </>
                      )}
                      ariaLabel={`Excluir responsável ${guardian.person.name}`}
                    />
                  ) : null}
                </TableActions>
              ) : 'Nenhuma ação'}
            </td>
        </tr>
      ))}
    </StudentRecordTable>
  );
}

function StudentCaseStudies({
  student,
  caseStudies,
  permissions,
  loading = false,
}: {
  student: StudentRecord;
  caseStudies: StudentCaseStudySummary[];
  permissions: Permissions;
  loading?: boolean;
}): React.JSX.Element {
  const filters = useStudentRecordFilters(['version', 'semester', 'status'] as const);
  const filteredCaseStudies = caseStudies.filter((caseStudy) => (
    matchesStudentRecordFilter(caseStudy.version, filters.values.version)
    && matchesStudentRecordFilter(caseStudy.semester_label, filters.values.semester)
    && (!filters.values.status || caseStudy.status === filters.values.status)
  ));
  const statusOptions = Array.from(new Map(
    caseStudies.map((item) => [item.status, item.status_label]),
  )).map(([value, label]) => ({ value, label }));

  return (
    <StudentRecordTable
      ariaLabel="Estudos de caso do aluno"
      columns={caseStudyColumns}
      count={filteredCaseStudies.length}
      emptyMessage="Nenhum Estudo de Caso encontrado."
      loading={loading}
      filters={(
        <StudentRecordFilters
          idPrefix="student-case-study-filter"
          label="Filtrar Estudos de Caso"
          fields={[
            { name: 'version', label: 'Versão' },
            { name: 'semester', label: 'Semestre' },
            { name: 'status', label: 'Status', options: statusOptions },
          ]}
          values={filters.values}
          onChange={filters.update}
          onClear={filters.clear}
        />
      )}
      actions={permissions['case-study.create'] ? (
        <TableListCreateButton
          href={`${aeeBase}/case-studies/${student.id}/create`}
          ariaLabel="Novo Estudo de Caso"
        />
      ) : undefined}
    >
      {filteredCaseStudies.map((caseStudy) => (
        <tr key={caseStudy.id}>
          <td><strong>v{caseStudy.version}</strong></td>
          <td>{caseStudy.semester_label ?? '—'}</td>
          <td>
            <TableLabel tone={caseStudyTones[caseStudy.status] ?? 'inverse'}>
              {caseStudy.status_label}
            </TableLabel>
          </td>
          <td>{dateLabel(caseStudy.created_at)}</td>
          <td>
            <TableActions>
              <Button
                href={`${aeeBase}/case-studies/${caseStudy.id}/show`}
                size="sm"
                tone="dark-blue"
                iconOnly
                leftIconClass="fa fa-eye"
                aria-label={`Visualizar Estudo de Caso versão ${caseStudy.version}`}
              />
            </TableActions>
          </td>
        </tr>
      ))}
    </StudentRecordTable>
  );
}

function StudentPaees({
  paees,
  loading = false,
}: {
  paees: StudentPaeeSummary[];
  loading?: boolean;
}): React.JSX.Element {
  const filters = useStudentRecordFilters(['version', 'semester', 'status'] as const);
  const filteredPaees = paees.filter((paee) => (
    matchesStudentRecordFilter(paee.version, filters.values.version)
    && matchesStudentRecordFilter(paee.semester_label, filters.values.semester)
    && (!filters.values.status || paee.status === filters.values.status)
  ));
  const statusOptions = Array.from(new Map(
    paees.map((item) => [item.status, item.status_label]),
  )).map(([value, label]) => ({ value, label }));

  return (
    <StudentRecordTable
      ariaLabel="PAEEs do aluno"
      columns={paeeColumns}
      count={filteredPaees.length}
      emptyMessage="Nenhum PAEE encontrado."
      loading={loading}
      filters={(
        <StudentRecordFilters
          idPrefix="student-paee-filter"
          label="Filtrar PAEEs"
          fields={[
            { name: 'version', label: 'Versão' },
            { name: 'semester', label: 'Semestre' },
            { name: 'status', label: 'Status', options: statusOptions },
          ]}
          values={filters.values}
          onChange={filters.update}
          onClear={filters.clear}
        />
      )}
    >
      {filteredPaees.map((paee) => (
        <tr key={paee.id}>
          <td><strong>v{paee.version}</strong></td>
          <td>{paee.semester_label ?? '—'}</td>
          <td>
            <TableLabel tone={paeeTones[paee.status] ?? 'inverse'}>
              {paee.status_label}
            </TableLabel>
          </td>
          <td>{dateLabel(paee.next_review_date)}</td>
          <td>
            <TableActions>
              <Button
                href={`${aeeBase}/paees/${paee.id}/show`}
                size="sm"
                tone="dark-blue"
                iconOnly
                leftIconClass="fa fa-eye"
                aria-label={`Visualizar PAEE versão ${paee.version}`}
              />
            </TableActions>
          </td>
        </tr>
      ))}
    </StudentRecordTable>
  );
}

export function createStudentSupportTabs({
  student,
  permissions,
  caseStudies,
  paees,
  loadingTab,
}: StudentSupportTabsProps): TabItem[] {
  const items: TabItem[] = [];

  if (permissions['student-deficiency.view']) {
    items.push({
      id: 'support-profiles',
      label: 'Perfis de atendimento',
      icon: 'fa fa-wheelchair',
      content: (
        <StudentProfiles
          student={student}
          permissions={permissions}
          loading={loadingTab === 'support-profiles'}
        />
      ),
    });
  }

  if (permissions['guardian.view']) {
    items.push({
      id: 'guardians',
      label: 'Responsáveis',
      icon: 'fa fa-users',
      content: (
        <StudentGuardians
          student={student}
          permissions={permissions}
          loading={loadingTab === 'guardians'}
        />
      ),
    });
  }

  if (permissions['case-study.view']) {
    items.push({
      id: 'case-studies',
      label: 'Estudos de Caso',
      icon: 'fa fa-stethoscope',
      content: (
        <StudentCaseStudies
          student={student}
          caseStudies={caseStudies}
          permissions={permissions}
          loading={loadingTab === 'case-studies'}
        />
      ),
    });
  }

  if (permissions['paee.view']) {
    items.push({
      id: 'paees',
      label: 'PAEE',
      icon: 'fa fa-sitemap',
      content: (
        <StudentPaees
          paees={paees}
          loading={loadingTab === 'paees'}
        />
      ),
    });
  }

  return items;
}
