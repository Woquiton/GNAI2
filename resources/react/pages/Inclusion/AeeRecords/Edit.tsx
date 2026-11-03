import { aeeRecordBreadcrumb } from '@/components/Inclusion/AeeRecords/AeeRecords.routes';
import type { AeeRecordEditProps } from '@/components/Inclusion/AeeRecords/AeeRecords.types';
import AeeRecordForm from '@/components/Inclusion/AeeRecords/Form/AeeRecordForm';
import { aeeRecordEditTour } from '@/components/Inclusion/AeeRecords/aeeRecordTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionAeeRecordsEditPage({
    aeeRecord,
    session,
    guardiansByStudent,
    startTimes,
    endTimes,
    attendanceTypeLabel,
    attendanceForm,
}: AeeRecordEditProps): React.JSX.Element {
    const sessionId = aeeRecord.attendance_session_id;

    return (
        <BusinessPage
            title="Editar Registro de Atendimento Educacional Especializado"
            subtitle={`Registro #${aeeRecord.id} • Agendamento #${sessionId}`}
            tour={aeeRecordEditTour}
            breadcrumbItems={aeeRecordBreadcrumb({
                sessionId,
                recordId: aeeRecord.id,
                current: 'Editar',
            })}
        >
            <AeeRecordForm
                key={aeeRecord.id}
                mode="edit"
                session={session}
                aeeRecord={aeeRecord}
                correction={{ startTimes, endTimes, attendanceTypeLabel, attendanceForm }}
                guardiansByStudent={guardiansByStudent}
            />
        </BusinessPage>
    );
}
