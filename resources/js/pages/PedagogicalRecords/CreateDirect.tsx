import PedagogicalRecordForm from '@/components/PedagogicalRecords/Form/PedagogicalRecordForm';
import { pedagogicalRecordDirectBreadcrumb } from '@/components/PedagogicalRecords/PedagogicalRecords.routes';
import type { PedagogicalRecordCreateDirectProps } from '@/components/PedagogicalRecords/PedagogicalRecords.types';
import { pedagogicalRecordCreateDirectTour } from '@/components/PedagogicalRecords/pedagogicalRecordTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

/** Registro de um atendimento pedagógico já realizado, sem agendamento prévio. */
export default function PedagogicalRecordsCreateDirectPage(
    props: PedagogicalRecordCreateDirectProps,
): React.JSX.Element {
    return (
        <BusinessPage
            title="Novo Registro de Atendimento Pedagógico"
            subtitle="Atendimento realizado sem agendamento prévio."
            breadcrumbItems={pedagogicalRecordDirectBreadcrumb(props.backUrl)}
            tour={pedagogicalRecordCreateDirectTour}
        >
            <PedagogicalRecordForm mode="direct" direct={props} />
        </BusinessPage>
    );
}
