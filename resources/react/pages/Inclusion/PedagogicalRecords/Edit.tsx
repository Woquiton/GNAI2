import PedagogicalRecordForm from '@/components/Inclusion/PedagogicalRecords/Form/PedagogicalRecordForm';
import { pedagogicalRecordBreadcrumb } from '@/components/Inclusion/PedagogicalRecords/PedagogicalRecords.routes';
import type { PedagogicalRecordEditProps } from '@/components/Inclusion/PedagogicalRecords/PedagogicalRecords.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionPedagogicalRecordsEditPage({
    pedagogicalRecord,
    context,
    returnStudentId,
}: PedagogicalRecordEditProps): React.JSX.Element {
    const breadcrumbItems = pedagogicalRecordBreadcrumb({
        sessionId: context.session_id,
        recordId: pedagogicalRecord.id,
        current: 'Editar',
    });

    return (
        <BusinessPage
            title="Editar Atendimento Pedagógico"
            subtitle={`Agendamento #${context.session_id}`}
            breadcrumbItems={breadcrumbItems}
        >
            <PedagogicalRecordForm
                key={pedagogicalRecord.id}
                record={pedagogicalRecord}
                context={context}
                returnStudentId={returnStudentId || undefined}
            />
        </BusinessPage>
    );
}
