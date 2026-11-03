import SupportRequestForm from '@/components/Inclusion/SupportRequests/Form/SupportRequestForm';
import { supportRequestBreadcrumb } from '@/components/Inclusion/SupportRequests/SupportRequests.routes';
import type { SupportRequestEditProps } from '@/components/Inclusion/SupportRequests/SupportRequests.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function EditSupportRequest(props: SupportRequestEditProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Editar Solicitação de Atendimento"
            subtitle={`Solicitação #${props.supportRequest.id} de ${props.supportRequest.student_name}.`}
            breadcrumbItems={supportRequestBreadcrumb(props.supportRequest, 'Editar')}
        >
            <SupportRequestForm key={props.supportRequest.id} {...props} />
        </BusinessPage>
    );
}
