import { aeeRecordDirectBreadcrumb } from '@/components/Inclusion/AeeRecords/AeeRecords.routes';
import type { AeeRecordCreateDirectProps } from '@/components/Inclusion/AeeRecords/AeeRecords.types';
import AeeRecordForm from '@/components/Inclusion/AeeRecords/Form/AeeRecordForm';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

/** Registro de um atendimento AEE já realizado, sem agendamento prévio. */
export default function InclusionAeeRecordsCreateDirectPage(
    props: AeeRecordCreateDirectProps,
): React.JSX.Element {
    return (
        <BusinessPage
            title="Novo Registro de Atendimento Educacional Especializado"
            subtitle="Atendimento realizado sem agendamento prévio."
            breadcrumbItems={aeeRecordDirectBreadcrumb(props.backUrl)}
        >
            <AeeRecordForm mode="direct" direct={props} />
        </BusinessPage>
    );
}
