import { aeeRecordDirectBreadcrumb } from '@/components/AeeRecords/AeeRecords.routes';
import type { AeeRecordCreateDirectProps } from '@/components/AeeRecords/AeeRecords.types';
import AeeRecordForm from '@/components/AeeRecords/Form/AeeRecordForm';
import { aeeRecordCreateDirectTour } from '@/components/AeeRecords/aeeRecordTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

/** Registro de um atendimento AEE já realizado, sem agendamento prévio. */
export default function AeeRecordsCreateDirectPage(
    props: AeeRecordCreateDirectProps,
): React.JSX.Element {
    return (
        <BusinessPage
            title="Novo Registro de Atendimento Educacional Especializado"
            subtitle="Atendimento realizado sem agendamento prévio."
            tour={aeeRecordCreateDirectTour}
            breadcrumbItems={aeeRecordDirectBreadcrumb(props.backUrl)}
        >
            <AeeRecordForm mode="direct" direct={props} />
        </BusinessPage>
    );
}
