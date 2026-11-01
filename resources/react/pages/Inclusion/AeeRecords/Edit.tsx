import { aeeRecordBreadcrumb } from '@/components/Inclusion/AeeRecords/AeeRecords.routes';
import type { AeeRecordEditProps } from '@/components/Inclusion/AeeRecords/AeeRecords.types';
import AeeRecordForm from '@/components/Inclusion/AeeRecords/Form/AeeRecordForm';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionAeeRecordsEditPage({
    aeeRecord,
    session,
    guardiansByStudent,
}: AeeRecordEditProps): React.JSX.Element {
    const sessionId = aeeRecord.attendance_session_id;

    return (
        <BusinessPage
            title="Editar Registro de atendimento AEE"
            subtitle={`Registro #${aeeRecord.id} • Agendamento #${sessionId}`}
            breadcrumbItems={aeeRecordBreadcrumb({
                sessionId,
                recordId: aeeRecord.id,
                current: 'Editar',
            })}
        >
            <AeeRecordForm
                key={aeeRecord.id}
                session={session}
                aeeRecord={aeeRecord}
                guardiansByStudent={guardiansByStudent}
            />
        </BusinessPage>
    );
}
