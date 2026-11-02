import { usePage } from '@inertiajs/react';
import PedagogicalRecordFilters from '@/components/Inclusion/PedagogicalRecords/List/PedagogicalRecordFilters';
import PedagogicalRecordList from '@/components/Inclusion/PedagogicalRecords/List/PedagogicalRecordList';
import PedagogicalRecordDeleteModal from '@/components/Inclusion/PedagogicalRecords/PedagogicalRecordDeleteModal';
import {
    emptyPedagogicalRecordFilters,
    pedagogicalRecordFailureTexts,
    studentPedagogicalRecordFilters,
} from '@/components/Inclusion/PedagogicalRecords/PedagogicalRecords.constants';
import {
    STUDENT_PEDAGOGICAL_RECORD_TAB,
    pedagogicalRecordUrls,
    studentPedagogicalRecordBreadcrumb,
} from '@/components/Inclusion/PedagogicalRecords/PedagogicalRecords.routes';
import type {
    PedagogicalRecordListRow,
    StudentPedagogicalRecordIndexProps,
} from '@/components/Inclusion/PedagogicalRecords/PedagogicalRecords.types';
import StudentRecordReturnButton from '@/components/Inclusion/Students/StudentRecordReturnButton';
import { TableListLayout, useTableListFilters } from '@/components/Tables/TableList/TableList';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function InclusionStudentsPedagogicalRecordsIndexPage({
    student,
    pedagogicalRecords,
    professionals,
    courses,
    students,
    filters: initialFilters,
    can,
}: StudentPedagogicalRecordIndexProps): React.JSX.Element {
    const studentName = student.name ?? 'Aluno';
    const errors = usePage().props.errors as Record<string, string | undefined>;
    const filters = useTableListFilters({
        url: pedagogicalRecordUrls.student(student.id),
        initialFilters,
        emptyFilters: emptyPedagogicalRecordFilters,
        failureText: pedagogicalRecordFailureTexts.list,
        pageParam: 'pedagogical_page',
    });
    const removal = useConfirmedAction<PedagogicalRecordListRow>({
        failureText: pedagogicalRecordFailureTexts.delete,
    });

    function openRemoval(record: PedagogicalRecordListRow): void {
        filters.cancelScheduled();
        removal.open(record);
    }

    function confirmRemoval(): void {
        if (removal.target) {
            filters.cancelScheduled();
            removal.submit('delete', pedagogicalRecordUrls.destroy(removal.target.id, student.id));
        }
    }

    return (
        <TableListLayout
            title="Histórico de Atendimentos Pedagógicos"
            subtitle={`Aluno: ${studentName}`}
            breadcrumbItems={studentPedagogicalRecordBreadcrumb({
                id: student.id,
                name: studentName,
            })}
            actions={
                <StudentRecordReturnButton
                    studentId={student.id}
                    tab={STUDENT_PEDAGOGICAL_RECORD_TAB}
                />
            }
            listLabel="Listagem de atendimentos pedagógicos"
            loading={filters.loading}
            loadingLabel="Atualizando atendimentos pedagógicos"
            filters={
                <PedagogicalRecordFilters
                    values={filters.values}
                    students={students}
                    professionals={professionals}
                    courses={courses}
                    primary={studentPedagogicalRecordFilters(can.view_all)}
                    errors={errors}
                    onUpdate={filters.update}
                    onClear={filters.clear}
                    onSubmit={filters.submit}
                />
            }
            dialogs={
                <PedagogicalRecordDeleteModal
                    open={removal.target !== null}
                    record={removal.target}
                    processing={removal.processing}
                    onClose={removal.close}
                    onConfirm={confirmRemoval}
                />
            }
        >
            <PedagogicalRecordList
                records={pedagogicalRecords}
                variant="student"
                permissions={can}
                studentId={student.id}
                loading={filters.loading}
                processing={removal.processing}
                onDelete={openRemoval}
                onPageSelect={filters.selectPage}
            />
        </TableListLayout>
    );
}
