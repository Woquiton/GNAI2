import PedagogicalRecordForm from '@/components/Inclusion/PedagogicalRecords/Form/PedagogicalRecordForm';
import { pedagogicalRecordBreadcrumb } from '@/components/Inclusion/PedagogicalRecords/PedagogicalRecords.routes';
import type { PedagogicalRecordEditProps } from '@/components/Inclusion/PedagogicalRecords/PedagogicalRecords.types';
import { pedagogicalRecordEditTour } from '@/components/Inclusion/PedagogicalRecords/pedagogicalRecordTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionPedagogicalRecordsEditPage({
    pedagogicalRecord,
    context,
    returnStudentId,
    startTimes,
    endTimes,
    attendanceTypeLabel,
    attendanceForm,
}: PedagogicalRecordEditProps): React.JSX.Element {
    const breadcrumbItems = pedagogicalRecordBreadcrumb({
        sessionId: context.session_id,
        recordId: pedagogicalRecord.id,
        current: 'Editar',
    });

    return (
        <BusinessPage
            title="Editar Registro de Atendimento Pedagógico"
            subtitle={`Agendamento #${context.session_id}`}
            breadcrumbItems={breadcrumbItems}
            tour={pedagogicalRecordEditTour}
        >
            <PedagogicalRecordForm
                key={pedagogicalRecord.id}
                mode="edit"
                record={pedagogicalRecord}
                context={context}
                correction={{ startTimes, endTimes, attendanceTypeLabel, attendanceForm }}
                returnStudentId={returnStudentId || undefined}
            />
        </BusinessPage>
    );
}
