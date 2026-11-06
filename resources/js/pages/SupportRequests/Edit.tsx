import SupportRequestForm from '@/components/SupportRequests/Form/SupportRequestForm';
import { supportRequestBreadcrumb } from '@/components/SupportRequests/SupportRequests.routes';
import type { SupportRequestEditProps } from '@/components/SupportRequests/SupportRequests.types';
import { supportRequestEditTour } from '@/components/SupportRequests/supportRequestTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function EditSupportRequest(props: SupportRequestEditProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Editar Solicitação de Atendimento"
            subtitle={`Solicitação #${props.supportRequest.id} de ${props.supportRequest.student_name}.`}
            breadcrumbItems={supportRequestBreadcrumb(
                props.supportRequest,
                'Editar',
                props.fromStudent
                    ? {
                          id: props.supportRequest.student_id,
                          name: props.supportRequest.student_name,
                      }
                    : undefined,
            )}
            tour={supportRequestEditTour}
        >
            <SupportRequestForm key={props.supportRequest.id} {...props} />
        </BusinessPage>
    );
}
