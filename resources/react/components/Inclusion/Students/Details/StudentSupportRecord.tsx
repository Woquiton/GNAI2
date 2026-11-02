import { caseStudyUrls } from '@/components/Inclusion/CaseStudies/CaseStudies.routes';
import { guardianShowUrl, guardianUrls } from '@/components/Inclusion/Guardians/Guardians.routes';
import { paeeUrls } from '@/components/Inclusion/Paees/Paees.routes';
import {
    studentDeficiencyUrls,
} from '@/components/Inclusion/StudentDeficiencies/StudentDeficiencies.routes';
import PersonIdentity from '@/components/Inclusion/People/PersonIdentity';
import type { TabItem } from '@/components/Navigation/Tabs/Tabs';
import {
    TableListCreateButton,
    TableListRowActions,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { dateLabel } from '@/utils/formatters';
import DeleteStudentRecord from '../DeleteStudentRecord';
import StudentRecordTable from '../StudentRecordTable';
import { caseStudyStatusTones, paeeStatusTones } from '../Students.constants';
import type {
    Permissions,
    StudentCaseStudySummary,
    StudentPaeeSummary,
    StudentRecord,
    StudentRecordTabId,
} from '../Students.types';
import StudentRecordFilters, {
    matchesStudentRecordFilter,
    useStudentRecordFilters,
} from './StudentRecordFilters';
import './StudentDetails.css';

type StudentProfile = NonNullable<StudentRecord['deficiencies']>[number];
type StudentGuardian = NonNullable<StudentRecord['guardians']>[number];

interface StudentSupportRecordProps {
    student: StudentRecord;
    permissions: Permissions;
}

interface StudentSupportTabsProps extends StudentSupportRecordProps {
    caseStudies: StudentCaseStudySummary[];
    paees: StudentPaeeSummary[];
    loadingTab?: StudentRecordTabId | null;
}

function profileColumns({
    student,
    permissions,
}: StudentSupportRecordProps): TableListColumn<StudentProfile>[] {
    const profileUrl = (profile: StudentProfile) =>
        studentDeficiencyUrls.show(student.id, profile.student_deficiency_id);

    return [
        {
            id: 'name',
            label: 'Perfil de atendimento',
            width: '46%',
            fixed: 'start',
            render: (profile) => <strong>{profile.name}</strong>,
        },
        {
            id: 'severity',
            label: 'Severidade',
            width: '26%',
            render: (profile) =>
                profile.severity_label ? (
                    <TableLabel tone={profile.severity_color ?? 'inverse'}>
                        {profile.severity_label}
                    </TableLabel>
                ) : (
                    'Não informada'
                ),
        },
        {
            id: 'actions',
            label: 'Ações',
            width: '28%',
            fixed: 'end',
            render: (profile) => (
                <TableListRowActions
                    view={
                        permissions['student-deficiency.view'] && {
                            href: profileUrl(profile),
                            label: `Visualizar perfil ${profile.name}`,
                        }
                    }
                >
                    {permissions['student-deficiency.delete'] ? (
                        <DeleteStudentRecord
                            action={profileUrl(profile)}
                            title="Excluir perfil de atendimento"
                            message="Remover este perfil de atendimento do registro do aluno?"
                            ariaLabel={`Excluir perfil ${profile.name}`}
                        />
                    ) : null}
                </TableListRowActions>
            ),
        },
    ];
}

function guardianColumns({
    student,
    permissions,
}: StudentSupportRecordProps): TableListColumn<StudentGuardian>[] {
    return [
        {
            id: 'guardian',
            label: 'Responsável',
            width: '28%',
            fixed: 'start',
            render: (guardian) => (
                <PersonIdentity name={guardian.person.name} photoUrl={guardian.person.photo_url} />
            ),
        },
        {
            id: 'document',
            label: 'CPF',
            width: '17%',
            render: (guardian) => guardian.person.document || 'Não informado',
        },
        {
            id: 'relationship',
            label: 'Vínculo',
            width: '17%',
            render: (guardian) => guardian.relationship_label,
        },
        {
            id: 'contact',
            label: 'Contato',
            width: '22%',
            render: (guardian) => guardian.person.email || guardian.person.phone || 'Não informado',
        },
        {
            id: 'actions',
            label: 'Ações',
            width: '16%',
            fixed: 'end',
            render: (guardian) => (
                <TableListRowActions
                    view={
                        permissions['guardian.view'] && {
                            href: guardianShowUrl(guardian.id),
                            label: `Visualizar responsável ${guardian.person.name}`,
                        }
                    }
                >
                    {permissions['guardian.delete'] ? (
                        <DeleteStudentRecord
                            action={guardianUrls(student.id).destroy(guardian.id)}
                            title="Excluir responsável"
                            message={
                                <>
                                    Remover o vínculo de <strong>{guardian.person.name}</strong>?
                                </>
                            }
                            ariaLabel={`Excluir responsável ${guardian.person.name}`}
                        />
                    ) : null}
                </TableListRowActions>
            ),
        },
    ];
}

const caseStudyColumns: TableListColumn<StudentCaseStudySummary>[] = [
    {
        id: 'version',
        label: 'Versão',
        width: '14%',
        fixed: 'start',
        render: (caseStudy) => <strong>v{caseStudy.version}</strong>,
    },
    {
        id: 'semester',
        label: 'Semestre',
        width: '26%',
        render: (caseStudy) => caseStudy.semester_label ?? '—',
    },
    {
        id: 'status',
        label: 'Status',
        width: '22%',
        render: (caseStudy) => (
            <TableLabel tone={caseStudyStatusTones[caseStudy.status] ?? 'inverse'}>
                {caseStudy.status_label}
            </TableLabel>
        ),
    },
    {
        id: 'date',
        label: 'Criado em',
        width: '20%',
        render: (caseStudy) => dateLabel(caseStudy.created_at),
    },
    {
        id: 'actions',
        label: 'Ações',
        width: '18%',
        fixed: 'end',
        render: (caseStudy) => (
            <TableListRowActions
                view={{
                    href: caseStudyUrls.show(caseStudy.id),
                    label: `Visualizar Estudo de Caso versão ${caseStudy.version}`,
                }}
            />
        ),
    },
];

const paeeColumns: TableListColumn<StudentPaeeSummary>[] = [
    {
        id: 'version',
        label: 'Versão',
        width: '14%',
        fixed: 'start',
        render: (paee) => <strong>v{paee.version}</strong>,
    },
    {
        id: 'semester',
        label: 'Semestre',
        width: '22%',
        render: (paee) => paee.semester_label ?? '—',
    },
    {
        id: 'current',
        label: 'Atual',
        width: '12%',
        render: (paee) => (
            <TableLabel tone={paee.is_current ? 'success' : 'inverse'}>
                {paee.is_current ? 'Sim' : 'Não'}
            </TableLabel>
        ),
    },
    {
        id: 'status',
        label: 'Status',
        width: '18%',
        render: (paee) => (
            <TableLabel tone={paeeStatusTones[paee.status] ?? 'inverse'}>
                {paee.status_label}
            </TableLabel>
        ),
    },
    {
        id: 'review',
        label: 'Próxima revisão',
        width: '18%',
        render: (paee) => dateLabel(paee.next_review_date),
    },
    {
        id: 'actions',
        label: 'Ações',
        width: '16%',
        fixed: 'end',
        render: (paee) => (
            <TableListRowActions
                view={{
                    href: paeeUrls.show(paee.id),
                    label: `Visualizar PAEE versão ${paee.version}`,
                }}
            />
        ),
    },
];

function StudentProfiles({
    student,
    permissions,
    loading = false,
}: StudentSupportRecordProps & { loading?: boolean }): React.JSX.Element {
    const profiles = student.deficiencies ?? [];
    const filters = useStudentRecordFilters(['name', 'severity'] as const);
    const filteredProfiles = profiles.filter(
        (profile) =>
            matchesStudentRecordFilter(profile.name, filters.values.name) &&
            matchesStudentRecordFilter(profile.severity_label, filters.values.severity),
    );
    const createAction = permissions['student-deficiency.create'] ? (
        <TableListCreateButton
            href={studentDeficiencyUrls.create(student.id)}
            ariaLabel="Cadastrar perfil de atendimento do aluno"
        />
    ) : undefined;

    return (
        <div id="deficiencias">
            <StudentRecordTable
                ariaLabel="Perfis de atendimento do aluno"
                columns={profileColumns({ student, permissions })}
                rows={filteredProfiles}
                rowKey={(profile) => profile.student_deficiency_id}
                emptyMessage="Nenhum perfil de atendimento do aluno encontrado."
                actions={createAction}
                loading={loading}
                filters={
                    <StudentRecordFilters
                        idPrefix="student-profile-filter"
                        label="Filtrar perfis de atendimento"
                        fields={[
                            { name: 'name', label: 'Perfil de atendimento' },
                            { name: 'severity', label: 'Severidade' },
                        ]}
                        values={filters.values}
                        onChange={filters.update}
                        onClear={filters.clear}
                    />
                }
            />
        </div>
    );
}

function StudentGuardians({
    student,
    permissions,
    loading = false,
}: StudentSupportRecordProps & { loading?: boolean }): React.JSX.Element {
    const guardians = student.guardians ?? [];
    const filters = useStudentRecordFilters(['name', 'relationship', 'contact'] as const);
    const filteredGuardians = guardians.filter(
        (guardian) =>
            matchesStudentRecordFilter(guardian.person.name, filters.values.name) &&
            matchesStudentRecordFilter(
                guardian.relationship_label,
                filters.values.relationship,
            ) &&
            matchesStudentRecordFilter(
                `${guardian.person.email ?? ''} ${guardian.person.phone ?? ''}`,
                filters.values.contact,
            ),
    );
    const createAction = permissions['guardian.create'] ? (
        <TableListCreateButton
            href={guardianUrls(student.id).create}
            ariaLabel="Cadastrar responsável do aluno"
        />
    ) : undefined;

    return (
        <div id="guardians">
            <StudentRecordTable
                ariaLabel="Responsáveis do aluno"
                columns={guardianColumns({ student, permissions })}
                rows={filteredGuardians}
                rowKey={(guardian) => guardian.id}
                emptyMessage="Nenhum responsável encontrado para este aluno."
                actions={createAction}
                loading={loading}
                filters={
                    <StudentRecordFilters
                        idPrefix="student-guardian-filter"
                        label="Filtrar responsáveis do aluno"
                        fields={[
                            { name: 'name', label: 'Responsável' },
                            { name: 'relationship', label: 'Vínculo' },
                            { name: 'contact', label: 'Contato' },
                        ]}
                        values={filters.values}
                        onChange={filters.update}
                        onClear={filters.clear}
                    />
                }
            />
        </div>
    );
}

function StudentCaseStudies({
    student,
    caseStudies,
    permissions,
    loading = false,
}: StudentSupportRecordProps & {
    caseStudies: StudentCaseStudySummary[];
    loading?: boolean;
}): React.JSX.Element {
    const filters = useStudentRecordFilters(['semester', 'status', 'date'] as const);
    const filteredCaseStudies = caseStudies.filter(
        (caseStudy) =>
            matchesStudentRecordFilter(caseStudy.semester_label, filters.values.semester) &&
            matchesStudentRecordFilter(caseStudy.status_label, filters.values.status) &&
            matchesStudentRecordFilter(caseStudy.created_at, filters.values.date),
    );
    const createAction = permissions['case-study.create'] ? (
        <TableListCreateButton
            href={caseStudyUrls.create(student.id)}
            ariaLabel="Novo Estudo de Caso"
        />
    ) : undefined;

    return (
        <div id="case-studies">
            <StudentRecordTable
                ariaLabel="Estudos de caso do aluno"
                columns={caseStudyColumns}
                rows={filteredCaseStudies}
                rowKey={(caseStudy) => caseStudy.id}
                emptyMessage="Nenhum Estudo de Caso encontrado."
                actions={createAction}
                loading={loading}
                filters={
                    <StudentRecordFilters
                        idPrefix="student-case-study-filter"
                        label="Filtrar Estudos de Caso"
                        fields={[
                            { name: 'semester', label: 'Semestre' },
                            { name: 'status', label: 'Status' },
                            { name: 'date', label: 'Data de criação' },
                        ]}
                        values={filters.values}
                        onChange={filters.update}
                        onClear={filters.clear}
                    />
                }
            />
        </div>
    );
}

function StudentPaees({
    paees,
    loading = false,
}: {
    paees: StudentPaeeSummary[];
    loading?: boolean;
}): React.JSX.Element {
    const filters = useStudentRecordFilters(['semester', 'status', 'review'] as const);
    const filteredPaees = paees.filter(
        (paee) =>
            matchesStudentRecordFilter(paee.semester_label, filters.values.semester) &&
            matchesStudentRecordFilter(paee.status_label, filters.values.status) &&
            matchesStudentRecordFilter(paee.next_review_date, filters.values.review),
    );

    return (
        <div id="paees">
            <StudentRecordTable
                ariaLabel="PAEEs do aluno"
                columns={paeeColumns}
                rows={filteredPaees}
                rowKey={(paee) => paee.id}
                emptyMessage="Nenhum PAEE encontrado."
                loading={loading}
                filters={
                    <StudentRecordFilters
                        idPrefix="student-paee-filter"
                        label="Filtrar PAEEs"
                        fields={[
                            { name: 'semester', label: 'Semestre' },
                            { name: 'status', label: 'Status' },
                            { name: 'review', label: 'Próxima revisão' },
                        ]}
                        values={filters.values}
                        onChange={filters.update}
                        onClear={filters.clear}
                    />
                }
            />
        </div>
    );
}

/** Abas de perfis de atendimento, responsáveis, Estudos de Caso e PAEE, conforme as permissões. */
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
