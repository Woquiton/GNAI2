import type { TabItem } from '@/components/Navigation/Tabs/Tabs';
import TableActions from '@/components/Tables/TableActions/TableActions';
import {
  TableListCreateButton,
  type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import Button from '@/components/UI/Button/Button';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import DeleteStudentRecord from './DeleteStudentRecord';
import StudentRecordTable from './StudentRecordTable';
import StudentSection from './StudentSection';
import type {
  Permissions,
  StudentCaseStudySummary,
  StudentPaeeSummary,
  StudentRecord,
} from './Students.types';
import { aeeBase, dateLabel } from './Students.utils';

interface StudentSupportRecordProps {
  student: StudentRecord;
  permissions: Permissions;
}

interface StudentSupportTabsProps extends StudentSupportRecordProps {
  caseStudies: StudentCaseStudySummary[];
  paees: StudentPaeeSummary[];
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
}: StudentSupportRecordProps): React.JSX.Element {
  const profiles = student.deficiencies ?? [];

  return (
    <StudentSection
      id="deficiencias"
      title="Perfis de Atendimento do Aluno"
      iconClass="fa fa-wheelchair"
    >
      <StudentRecordTable
        ariaLabel="Perfis de atendimento do aluno"
        columns={profileColumns}
        count={profiles.length}
        emptyMessage="Nenhum perfil de atendimento do aluno encontrado."
        actions={permissions['student-deficiency.create'] ? (
          <TableListCreateButton
            href={`${aeeBase}/students/${student.id}/deficiencies/create`}
            ariaLabel="Cadastrar perfil de atendimento do aluno"
          />
        ) : undefined}
      >
        {profiles.map((profile) => (
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
    </StudentSection>
  );
}

function StudentGuardians({
  student,
  permissions,
}: StudentSupportRecordProps): React.JSX.Element {
  const guardians = student.guardians ?? [];

  return (
    <StudentSection
      id="guardians"
      title="Responsáveis"
      iconClass="fa fa-users"
    >
      <StudentRecordTable
        ariaLabel="Responsáveis do aluno"
        columns={guardianColumns}
        count={guardians.length}
        emptyMessage="Nenhum responsável encontrado para este aluno."
        actions={permissions['guardian.create'] ? (
          <TableListCreateButton
            href={`${aeeBase}/students/${student.id}/guardians/create`}
            ariaLabel="Cadastrar responsável do aluno"
          />
        ) : undefined}
      >
        {guardians.map((guardian) => (
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
    </StudentSection>
  );
}

function StudentCaseStudies({
  student,
  caseStudies,
  permissions,
}: {
  student: StudentRecord;
  caseStudies: StudentCaseStudySummary[];
  permissions: Permissions;
}): React.JSX.Element {
  return (
    <StudentSection
      id="case-studies"
      title="Estudos de Caso"
      iconClass="fa fa-stethoscope"
    >
      <StudentRecordTable
        ariaLabel="Estudos de caso do aluno"
        columns={caseStudyColumns}
        count={caseStudies.length}
        emptyMessage="Nenhum Estudo de Caso encontrado."
        actions={permissions['case-study.create'] ? (
          <TableListCreateButton
            href={`${aeeBase}/case-studies/${student.id}/create`}
            ariaLabel="Novo Estudo de Caso"
          />
        ) : undefined}
      >
        {caseStudies.map((caseStudy) => (
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
      <div className="studentsPage__recordFooter">
        <small>
          São exibidas até 5 versões mais recentes. Para consultar o histórico completo, clique em "Ver Histórico".
        </small>
        <Button
          href={`${aeeBase}/students/${student.id}/case-studies/history`}
          tone="white"
          size="sm"
          leftIconClass="fa fa-history"
          label="Ver Histórico"
          title="Ver histórico de Estudos de Caso"
          aria-label="Ver histórico de Estudos de Caso"
        />
      </div>
    </StudentSection>
  );
}

function StudentPaees({
  student,
  paees,
}: {
  student: StudentRecord;
  paees: StudentPaeeSummary[];
}): React.JSX.Element {
  return (
    <StudentSection
      id="paees"
      title="PAEE"
      iconClass="fa fa-sitemap"
    >
      <StudentRecordTable
        ariaLabel="PAEEs do aluno"
        columns={paeeColumns}
        count={paees.length}
        emptyMessage="Nenhum PAEE encontrado."
      >
        {paees.map((paee) => (
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
      <div className="studentsPage__recordFooter">
        <small>
          São exibidas até 5 versões mais recentes. Para consultar o histórico completo, clique em "Gerenciar PAEE".
        </small>
        <Button
          href={`${aeeBase}/students/${student.id}/paees`}
          tone="white"
          size="sm"
          leftIconClass="fa fa-folder-open"
          label="Gerenciar PAEE"
          title="Gerenciar PAEEs do aluno"
          aria-label="Gerenciar PAEEs do aluno"
        />
      </div>
    </StudentSection>
  );
}

export function createStudentSupportTabs({
  student,
  permissions,
  caseStudies,
  paees,
}: StudentSupportTabsProps): TabItem[] {
  const items: TabItem[] = [];

  if (permissions['student-deficiency.view']) {
    items.push({
      id: 'support-profiles',
      label: 'Perfis de atendimento',
      icon: 'fa fa-wheelchair',
      content: (
        <StudentProfiles student={student} permissions={permissions} />
      ),
    });
  }

  if (permissions['guardian.view']) {
    items.push({
      id: 'guardians',
      label: 'Responsáveis',
      icon: 'fa fa-users',
      content: (
        <StudentGuardians student={student} permissions={permissions} />
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
        />
      ),
    });
  }

  if (permissions['paee.view']) {
    items.push({
      id: 'paees',
      label: 'PAEE',
      icon: 'fa fa-sitemap',
      content: <StudentPaees student={student} paees={paees} />,
    });
  }

  return items;
}
