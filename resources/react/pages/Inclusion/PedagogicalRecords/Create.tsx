import PedagogicalRecordForm from '@/components/Inclusion/PedagogicalRecords/Form/PedagogicalRecordForm';
import { pedagogicalRecordBreadcrumb } from '@/components/Inclusion/PedagogicalRecords/PedagogicalRecords.routes';
import type { PedagogicalRecordCreateProps } from '@/components/Inclusion/PedagogicalRecords/PedagogicalRecords.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionPedagogicalRecordsCreatePage({
    context,
}: PedagogicalRecordCreateProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Novo Registro de Atendimento Pedagógico"
            subtitle={`Agendamento #${context.session_id}`}
            breadcrumbItems={pedagogicalRecordBreadcrumb({ sessionId: context.session_id })}
        >
            <PedagogicalRecordForm mode="session" context={context} />
        </BusinessPage>
    );
}
