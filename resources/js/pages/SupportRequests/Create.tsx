import SupportRequestForm from '@/components/SupportRequests/Form/SupportRequestForm';
import { supportRequestBreadcrumb } from '@/components/SupportRequests/SupportRequests.routes';
import type { SupportRequestCreateProps } from '@/components/SupportRequests/SupportRequests.types';
import { supportRequestCreateTour } from '@/components/SupportRequests/supportRequestTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function CreateSupportRequest(props: SupportRequestCreateProps): React.JSX.Element {
    const student =
        props.fromStudent && props.selectedStudentId
            ? {
                  id: Number(props.selectedStudentId),
                  name:
                      props.options.students.find(
                          (option) => option.value === props.selectedStudentId,
                      )?.label ?? 'Aluno',
              }
            : undefined;
    return (
        <BusinessPage
            title="Registrar Solicitação de Atendimento"
            subtitle="Registre a demanda apresentada pelo aluno, familiar ou setor da instituição."
            breadcrumbItems={supportRequestBreadcrumb(undefined, 'Cadastrar', student)}
            tour={supportRequestCreateTour}
        >
            <SupportRequestForm {...props} />
        </BusinessPage>
    );
}
