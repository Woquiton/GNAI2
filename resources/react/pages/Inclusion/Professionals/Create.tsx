import ProfessionalForm from '@/components/Inclusion/Professionals/Form/ProfessionalForm';
import { professionalBreadcrumb } from '@/components/Inclusion/Professionals/Professionals.routes';
import type { ProfessionalFormOptions } from '@/components/Inclusion/Professionals/Professionals.types';
import { professionalCreateTour } from '@/components/Inclusion/Professionals/professionalTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionProfessionalsCreatePage(
    options: ProfessionalFormOptions,
): React.JSX.Element {
    return (
        <BusinessPage
            title="Novo Profissional"
            subtitle="Cadastre os dados pessoais e funcionais de um profissional ou tutor de pares. Mesmo com o título “Profissionais”, esta seção também permite o cadastro de tutores de pares, utilizando a mesma estrutura."
            breadcrumbItems={professionalBreadcrumb({ current: 'Cadastrar' })}
            tour={professionalCreateTour}
        >
            <ProfessionalForm mode="create" options={options} />
        </BusinessPage>
    );
}
