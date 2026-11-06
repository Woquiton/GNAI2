import { aeeStudentName } from '@/components/AeeRecords/AeeRecords.constants';
import { studentAeeRecordBreadcrumb } from '@/components/AeeRecords/AeeRecords.routes';
import type { StudentAeeRecordEditProps } from '@/components/AeeRecords/AeeRecords.types';
import StudentAeeEvaluationForm from '@/components/AeeRecords/Form/StudentAeeEvaluationForm';
import { studentAeeRecordEditTour } from '@/components/AeeRecords/aeeRecordTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function StudentsAeeRecordsEditPage({
    student,
    evaluation,
    guardians,
}: StudentAeeRecordEditProps): React.JSX.Element {
    const aeeRecord = evaluation.aee_record;
    const studentName = aeeStudentName(evaluation.student, student.id);
    const subtitle = `${studentName} • Registro #${aeeRecord.id} • Agendamento #${aeeRecord.attendance_session_id}`;

    return (
        <BusinessPage
            title="Editar Avaliação do Aluno"
            subtitle={subtitle}
            tour={studentAeeRecordEditTour}
            breadcrumbItems={studentAeeRecordBreadcrumb({
                studentId: student.id,
                studentName,
                evaluationId: evaluation.id,
                current: 'Editar',
            })}
        >
            <StudentAeeEvaluationForm
                student={student}
                evaluation={evaluation}
                guardians={guardians}
            />
        </BusinessPage>
    );
}
