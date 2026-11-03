import SupportRequestForm from '@/components/Inclusion/SupportRequests/Form/SupportRequestForm';
import { supportRequestBreadcrumb } from '@/components/Inclusion/SupportRequests/SupportRequests.routes';
import type { SupportRequestCreateProps } from '@/components/Inclusion/SupportRequests/SupportRequests.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function CreateSupportRequest(props: SupportRequestCreateProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Registrar Solicitação de Atendimento"
            subtitle="Registre a demanda apresentada pelo aluno, familiar ou setor da instituição."
            breadcrumbItems={supportRequestBreadcrumb(undefined, 'Cadastrar')}
        >
            <SupportRequestForm {...props} />
        </BusinessPage>
    );
}
