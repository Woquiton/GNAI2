import ProfessionalForm from '@/components/Professionals/Form/ProfessionalForm';
import { professionalBreadcrumb } from '@/components/Professionals/Professionals.routes';
import type { ProfessionalEditProps } from '@/components/Professionals/Professionals.types';
import { professionalEditTour } from '@/components/Professionals/professionalTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function ProfessionalsEditPage({
    professional,
    ...options
}: ProfessionalEditProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Editar Profissional"
            tour={professionalEditTour}
            subtitle="Edite os dados pessoais e funcionais do profissional ou tutor de pares. Mesmo com o título “Profissionais”, esta seção permite a atualização de informações de tutores de pares."
            breadcrumbItems={professionalBreadcrumb({
                professional: { id: professional.id, name: professional.person.name },
                current: 'Editar',
            })}
        >
            <ProfessionalForm
                key={professional.id}
                mode="edit"
                options={options}
                professional={professional}
            />
        </BusinessPage>
    );
}
