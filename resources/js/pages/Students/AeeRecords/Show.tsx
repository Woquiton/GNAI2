import AeeRecordDeleteModal from '@/components/AeeRecords/AeeRecordDeleteModal';
import {
    AEE_DELETE_FAILURE_TEXT,
    aeeStudentName,
} from '@/components/AeeRecords/AeeRecords.constants';
import {
    studentAeeRecordBreadcrumb,
    studentAeeRecordUrls,
} from '@/components/AeeRecords/AeeRecords.routes';
import type { StudentAeeRecordShowProps } from '@/components/AeeRecords/AeeRecords.types';
import StudentAeeEvaluationDetails from '@/components/AeeRecords/Details/StudentAeeEvaluationDetails';
import StudentAeeEvaluationDetailsActions from '@/components/AeeRecords/Details/StudentAeeEvaluationDetailsActions';
import { studentAeeRecordShowTour } from '@/components/AeeRecords/aeeRecordTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';
import { dateLabel } from '@/utils/formatters';

export default function StudentsAeeRecordsShowPage({
    student,
    evaluation,
    can,
}: StudentAeeRecordShowProps): React.JSX.Element {
    const aeeRecord = evaluation.aee_record;
    const studentName = aeeStudentName(evaluation.student, student.id);
    const sessionDate = dateLabel(aeeRecord.attendance_session?.session_date);
    const subtitle = `${studentName} • Agendamento #${aeeRecord.attendance_session_id} • Realizada em: ${sessionDate}`;
    const deletion = useConfirmedAction<number>({ failureText: AEE_DELETE_FAILURE_TEXT });
    const deletionUrl = studentAeeRecordUrls(student.id).destroy(evaluation.id);

    return (
        <BusinessPage
            title="Registro de atendimento AEE do Aluno"
            subtitle={subtitle}
            tour={studentAeeRecordShowTour}
            breadcrumbItems={studentAeeRecordBreadcrumb({
                studentId: student.id,
                studentName,
                current: 'Visualizar',
            })}
            busy={deletion.processing}
        >
            <StudentAeeEvaluationDetails evaluation={evaluation} studentName={studentName} />
            <StudentAeeEvaluationDetailsActions
                studentId={student.id}
                evaluationId={evaluation.id}
                recordId={aeeRecord.id}
                permissions={can}
                deleting={deletion.processing}
                onDelete={() => deletion.open(evaluation.id)}
            />
            <AeeRecordDeleteModal
                scope="evaluation"
                open={deletion.target !== null}
                processing={deletion.processing}
                onClose={deletion.close}
                onConfirm={() => deletion.submit('delete', deletionUrl)}
            />
        </BusinessPage>
    );
}
