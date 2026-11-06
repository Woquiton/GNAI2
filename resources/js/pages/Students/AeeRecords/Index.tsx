import { usePage } from '@inertiajs/react';
import AeeRecordDeleteModal from '@/components/AeeRecords/AeeRecordDeleteModal';
import {
    AEE_DELETE_FAILURE_TEXT,
    STUDENT_AEE_LIST_FAILURE_TEXT,
    aeeStudentName,
    emptyAeeRecordFilters,
    studentAeeRecordFilters,
} from '@/components/AeeRecords/AeeRecords.constants';
import {
    STUDENT_AEE_RECORD_TAB,
    studentAeeRecordBreadcrumb,
    studentAeeRecordUrls,
} from '@/components/AeeRecords/AeeRecords.routes';
import type {
    AeeStudentEvaluationListItem,
    StudentAeeRecordIndexProps,
} from '@/components/AeeRecords/AeeRecords.types';
import AeeRecordFilters from '@/components/AeeRecords/List/AeeRecordFilters';
import StudentAeeRecordList from '@/components/AeeRecords/List/StudentAeeRecordList';
import { studentAeeRecordIndexTour } from '@/components/AeeRecords/aeeRecordTours';
import StudentRecordReturnButton from '@/components/Students/StudentRecordReturnButton';
import { TableListLayout, useTableListFilters } from '@/components/Tables/TableList/TableList';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function StudentsAeeRecordsIndexPage({
    student,
    aeeEvaluations,
    filters: initialFilters,
    professionals,
    can,
}: StudentAeeRecordIndexProps): React.JSX.Element {
    const errors = usePage().props.errors as Record<string, string | undefined>;
    const studentName = aeeStudentName(student, student.id);
    const urls = studentAeeRecordUrls(student.id);
    const filters = useTableListFilters({
        url: urls.index,
        initialFilters,
        emptyFilters: emptyAeeRecordFilters,
        failureText: STUDENT_AEE_LIST_FAILURE_TEXT,
    });
    const removal = useConfirmedAction<AeeStudentEvaluationListItem>({
        failureText: AEE_DELETE_FAILURE_TEXT,
    });

    const returnAction = (
        <StudentRecordReturnButton studentId={student.id} tab={STUDENT_AEE_RECORD_TAB} />
    );

    function confirmRemoval(): void {
        if (removal.target) {
            filters.cancelScheduled();
            removal.submit('delete', urls.destroy(removal.target.id));
        }
    }

    return (
        <TableListLayout
            title="Histórico de Registros de Atendimento AEE"
            subtitle={`Aluno: ${studentName}`}
            breadcrumbItems={studentAeeRecordBreadcrumb({ studentId: student.id, studentName })}
            actions={returnAction}
            listLabel="Listagem de registros de atendimento AEE do aluno"
            tour={studentAeeRecordIndexTour}
            loading={filters.loading}
            loadingLabel="Atualizando registros de atendimento AEE"
            filters={
                <AeeRecordFilters
                    idPrefix="student-aee-records"
                    label="Filtrar registros de atendimento AEE do aluno"
                    fields={studentAeeRecordFilters(can.view_all)}
                    values={filters.values}
                    errors={errors}
                    professionals={professionals}
                    onUpdate={filters.update}
                    onClear={filters.clear}
                    onSubmit={filters.submit}
                />
            }
            dialogs={
                <AeeRecordDeleteModal
                    scope="evaluation"
                    open={removal.target !== null}
                    processing={removal.processing}
                    onClose={removal.close}
                    onConfirm={confirmRemoval}
                />
            }
        >
            <StudentAeeRecordList
                studentId={student.id}
                aeeEvaluations={aeeEvaluations}
                permissions={can}
                loading={filters.loading}
                processing={removal.processing}
                onDelete={removal.open}
                onPageSelect={filters.selectPage}
            />
        </TableListLayout>
    );
}
