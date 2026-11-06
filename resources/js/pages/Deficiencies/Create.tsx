import { deficiencyDescription } from '@/components/Deficiencies/Deficiencies.constants';
import { deficiencyBreadcrumb } from '@/components/Deficiencies/Deficiencies.routes';
import DeficiencyForm from '@/components/Deficiencies/Form/DeficiencyForm';
import { deficiencyCreateTour } from '@/components/Deficiencies/deficiencyTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function DeficienciesCreatePage(): React.JSX.Element {
    return (
        <BusinessPage
            title="Cadastrar Novo Perfil de Atendimento"
            subtitle={deficiencyDescription}
            breadcrumbItems={deficiencyBreadcrumb({ current: 'Cadastrar' })}
            tour={deficiencyCreateTour}
        >
            <DeficiencyForm />
        </BusinessPage>
    );
}
