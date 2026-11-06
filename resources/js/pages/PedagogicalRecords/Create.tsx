import PedagogicalRecordForm from '@/components/PedagogicalRecords/Form/PedagogicalRecordForm';
import { pedagogicalRecordBreadcrumb } from '@/components/PedagogicalRecords/PedagogicalRecords.routes';
import type { PedagogicalRecordCreateProps } from '@/components/PedagogicalRecords/PedagogicalRecords.types';
import { pedagogicalRecordCreateTour } from '@/components/PedagogicalRecords/pedagogicalRecordTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function PedagogicalRecordsCreatePage({
    context,
}: PedagogicalRecordCreateProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Novo Registro de Atendimento Pedagógico"
            subtitle={`Agendamento #${context.session_id}`}
            breadcrumbItems={pedagogicalRecordBreadcrumb({ sessionId: context.session_id })}
            tour={pedagogicalRecordCreateTour}
        >
            <PedagogicalRecordForm mode="session" context={context} />
        </BusinessPage>
    );
}
