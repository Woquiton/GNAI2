import PedagogicalRecordForm from '@/components/Inclusion/PedagogicalRecords/Form/PedagogicalRecordForm';
import { pedagogicalRecordDirectBreadcrumb } from '@/components/Inclusion/PedagogicalRecords/PedagogicalRecords.routes';
import type { PedagogicalRecordCreateDirectProps } from '@/components/Inclusion/PedagogicalRecords/PedagogicalRecords.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

/** Registro de um atendimento pedagógico já realizado, sem agendamento prévio. */
export default function InclusionPedagogicalRecordsCreateDirectPage(
    props: PedagogicalRecordCreateDirectProps,
): React.JSX.Element {
    return (
        <BusinessPage
            title="Novo Registro de Atendimento Pedagógico"
            subtitle="Atendimento realizado sem agendamento prévio."
            breadcrumbItems={pedagogicalRecordDirectBreadcrumb(props.backUrl)}
        >
            <PedagogicalRecordForm mode="direct" direct={props} />
        </BusinessPage>
    );
}
