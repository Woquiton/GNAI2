import {
    pedagogicalRecordUrls,
} from '@/components/Inclusion/PedagogicalRecords/PedagogicalRecords.routes';
import type { TabItem } from '@/components/Navigation/Tabs/Tabs';
import { TableListRowActions, type TableListColumn } from '@/components/Tables/TableList/TableList';
import Button from '@/components/UI/Button/Button';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { dateLabel } from '@/utils/formatters';
import DeleteStudentRecord from '../DeleteStudentRecord';
import StudentRecordTable from '../StudentRecordTable';
import { studentUrl } from '../Students.routes';
import type {
    AttendanceSession,
    Permissions,
    StudentRecordTabId,
    StudentShowProps,
} from '../Students.types';
import StudentRecordFilters, {
    matchesStudentRecordFilter,
    useStudentRecordFilters,
} from './StudentRecordFilters';

interface AttendanceRow {
    id: number;
    session?: AttendanceSession | null;
    duration?: number | string | null;
    present: boolean;
    guardians?: boolean;
    canManage: boolean;
    href: string;
    editHref: string;
    deleteHref: string;
    pdfHref?: string;
}

type AttendanceKind = 'aee' | 'pedagogical';

interface AttendancePanelProps {
    kind: AttendanceKind;
    title: string;
    emptyMessage: string;
    rows: AttendanceRow[];
    studentId: number;
    permissions: Permissions;
    loading?: boolean;
}

const attendanceTexts: Record<
    AttendanceKind,
    { sectionId: string; pdfPath: string; deleteTitle: string; deleteMessage: string }
> = {
    aee: {
        sectionId: 'aee-records',
        pdfPath: 'atendimentos-aee/pdf',
        deleteTitle: 'Excluir registro do aluno',
        deleteMessage: 'Excluir apenas o registro deste aluno neste atendimento AEE?',
    },
    pedagogical: {
        sectionId: 'pedagogical-records',
        pdfPath: 'atendimentos-pedagogicos/pdf',
        deleteTitle: 'Excluir atendimento pedagógico',
        deleteMessage: 'Excluir este atendimento pedagógico?',
    },
};

function sessionTime(session?: AttendanceSession | null): string {
    if (!session?.start_time) {
        return '---';
    }

    const start = session.start_time.slice(0, 5);
    const end = session.end_time?.slice(0, 5);

    return end ? `${start} a ${end}` : start;
}

function AttendanceRowActions({
    row,
    kind,
    permissions,
}: {
    row: AttendanceRow;
    kind: AttendanceKind;
    permissions: Permissions;
}): React.JSX.Element {
    const prefix = `${kind}-record`;
    const canView = permissions[`${prefix}.view`];
    const canUpdate = permissions[`${prefix}.update`] && row.canManage;
    const canDelete = permissions[`${prefix}.delete`] && row.canManage;
    const sessionDate = dateLabel(row.session?.session_date);
    const texts = attendanceTexts[kind];
    const pdfAction =
        canView && row.pdfHref ? (
            <Button
                href={row.pdfHref}
                target="_blank"
                rel="noopener noreferrer"
                size="sm"
                tone="cancel"
                iconOnly
                leftIconClass="fa fa-file-pdf-o"
                title="PDF"
                aria-label={`Gerar PDF do atendimento de ${sessionDate}`}
            />
        ) : null;
    const extraActions =
        pdfAction || canUpdate || canDelete ? (
            <>
                {pdfAction}
                {canUpdate ? (
                    <Button
                        href={row.editHref}
                        size="sm"
                        tone="warning"
                        iconOnly
                        leftIconClass="fa fa-pencil"
                        title="Editar"
                        aria-label={`Editar atendimento de ${sessionDate}`}
                    />
                ) : null}
                {canDelete ? (
                    <DeleteStudentRecord
                        action={row.deleteHref}
                        title={texts.deleteTitle}
                        message={texts.deleteMessage}
                        ariaLabel={`Excluir atendimento de ${sessionDate}`}
                    />
                ) : null}
            </>
        ) : null;

    return (
        <TableListRowActions
            view={canView && { href: row.href, label: `Visualizar atendimento de ${sessionDate}` }}
        >
            {extraActions}
        </TableListRowActions>
    );
}

function attendanceColumns(
    kind: AttendanceKind,
    permissions: Permissions,
): TableListColumn<AttendanceRow>[] {
    const pedagogical = kind === 'pedagogical';
    const date: TableListColumn<AttendanceRow> = {
        id: 'date',
        label: 'Data',
        width: pedagogical ? '13%' : '19%',
        fixed: 'start',
        render: (row) => <strong>{dateLabel(row.session?.session_date)}</strong>,
    };
    const time: TableListColumn<AttendanceRow> = {
        id: 'time',
        label: 'Horário',
        width: '13%',
        render: (row) => sessionTime(row.session),
    };
    const professional: TableListColumn<AttendanceRow> = {
        id: 'professional',
        label: 'Profissional',
        width: pedagogical ? '19%' : '28%',
        render: (row) => row.session?.professional?.person?.name ?? 'Não informado',
    };
    const duration: TableListColumn<AttendanceRow> = {
        id: 'duration',
        label: 'Duração',
        width: pedagogical ? '11%' : '15%',
        render: (row) => row.duration ?? '---',
    };
    const presence: TableListColumn<AttendanceRow> = {
        id: 'presence',
        label: 'Presença',
        width: pedagogical ? '12%' : '16%',
        render: (row) => (
            <TableLabel tone={row.present ? 'success' : 'danger'}>
                {row.present ? 'Presente' : 'Ausente'}
            </TableLabel>
        ),
    };
    const guardians: TableListColumn<AttendanceRow> = {
        id: 'guardians',
        label: 'Responsáveis',
        width: '12%',
        render: (row) => (
            <TableLabel tone={row.guardians ? 'success' : 'inverse'}>
                {row.guardians ? 'Sim' : 'Não'}
            </TableLabel>
        ),
    };
    const actions: TableListColumn<AttendanceRow> = {
        id: 'actions',
        label: 'Ações',
        width: pedagogical ? '20%' : '22%',
        fixed: 'end',
        render: (row) => <AttendanceRowActions row={row} kind={kind} permissions={permissions} />,
    };

    return pedagogical
        ? [date, time, professional, duration, presence, guardians, actions]
        : [date, professional, duration, presence, actions];
}

function AttendancePanel({
    kind,
    title,
    emptyMessage,
    rows,
    studentId,
    permissions,
    loading = false,
}: AttendancePanelProps): React.JSX.Element {
    const texts = attendanceTexts[kind];
    const filters = useStudentRecordFilters(['date', 'professional', 'presence'] as const);
    const filteredRows = rows.filter(
        (row) =>
            matchesStudentRecordFilter(
                `${row.session?.session_date ?? ''} ${dateLabel(row.session?.session_date)}`,
                filters.values.date,
            ) &&
            matchesStudentRecordFilter(
                row.session?.professional?.person?.name,
                filters.values.professional,
            ) &&
            (!filters.values.presence ||
                filters.values.presence === (row.present ? 'present' : 'absent')),
    );
    const historyAction = permissions[`${kind}-record.view`] ? (
        <Button
            href={studentUrl(studentId, texts.pdfPath)}
            target="_blank"
            rel="noopener noreferrer"
            tone="dark-red"
            leftIconClass="fa fa-file-pdf-o"
        >
            Histórico em PDF
        </Button>
    ) : undefined;

    return (
        <div id={texts.sectionId}>
            <StudentRecordTable
                ariaLabel={title}
                columns={attendanceColumns(kind, permissions)}
                rows={filteredRows}
                rowKey={(row) => row.id}
                emptyMessage={emptyMessage}
                actions={historyAction}
                loading={loading}
                filters={
                    <StudentRecordFilters
                        idPrefix={`student-${texts.sectionId}-filter`}
                        label={`Filtrar ${title.toLocaleLowerCase('pt-BR')}`}
                        fields={[
                            { name: 'date', label: 'Data' },
                            { name: 'professional', label: 'Profissional' },
                            {
                                name: 'presence',
                                label: 'Presença',
                                options: [
                                    { value: 'present', label: 'Presente' },
                                    { value: 'absent', label: 'Ausente' },
                                ],
                            },
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

/** Abas dos atendimentos AEE e pedagógicos, conforme as permissões de visualização. */
export function createStudentAttendanceTabs({
    student,
    permissions,
    aeeEvaluations = [],
    pedagogicalRecords = [],
    loadingTab,
}: Pick<
    StudentShowProps,
    'student' | 'permissions' | 'aeeEvaluations' | 'pedagogicalRecords'
> & { loadingTab?: StudentRecordTabId | null }): TabItem[] {
    const canAee = permissions['aee-record.view-all'] || permissions['aee-record.view-own'];
    const canPedagogical =
        permissions['pedagogical-record.view-all'] || permissions['pedagogical-record.view-own'];
    const items: TabItem[] = [];

    if (canAee) {
        items.push({
            id: 'aee-attendance',
            label: 'Atendimentos AEE',
            icon: 'fa fa-calendar-check-o',
            content: (
                <AttendancePanel
                    kind="aee"
                    title="Registros de Atendimentos AEE"
                    emptyMessage="Nenhum registro de atendimento AEE encontrado."
                    studentId={student.id}
                    permissions={permissions}
                    loading={loadingTab === 'aee-attendance'}
                    rows={aeeEvaluations.map((item) => ({
                        id: item.id,
                        session: item.aee_record?.attendance_session,
                        duration: item.aee_record?.duration,
                        present: item.is_present,
                        guardians: undefined,
                        canManage: item.can_manage ?? false,
                        href: studentUrl(student.id, `atendimentos-aee/${item.id}/visualizar`),
                        editHref: studentUrl(student.id, `atendimentos-aee/${item.id}/editar`),
                        deleteHref: studentUrl(student.id, `atendimentos-aee/${item.id}`),
                    }))}
                />
            ),
        });
    }

    if (canPedagogical) {
        items.push({
            id: 'pedagogical-attendance',
            label: 'Atendimentos pedagógicos',
            icon: 'fa fa-comments-o',
            content: (
                <AttendancePanel
                    kind="pedagogical"
                    title="Atendimentos Pedagógicos"
                    emptyMessage="Nenhum atendimento pedagógico encontrado."
                    studentId={student.id}
                    permissions={permissions}
                    loading={loadingTab === 'pedagogical-attendance'}
                    rows={pedagogicalRecords.map((item) => ({
                        id: item.id,
                        session: item.attendance_session,
                        duration: item.duration,
                        present: item.is_present,
                        guardians: item.guardians.length > 0,
                        canManage: item.can_manage ?? false,
                        href: pedagogicalRecordUrls.show(item.id, student.id),
                        editHref: pedagogicalRecordUrls.edit(item.id, student.id),
                        deleteHref: pedagogicalRecordUrls.destroy(item.id, student.id),
                        pdfHref: pedagogicalRecordUrls.pdf(item.id),
                    }))}
                />
            ),
        });
    }

    return items;
}
