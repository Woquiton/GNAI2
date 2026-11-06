import InstitutionForm from '@/components/Institutions/Form/InstitutionForm';
import { institutionCreateTour } from '@/components/Institutions/institutionTours';
import { institutionBreadcrumb } from '@/components/Institutions/Institutions.routes';
import type { InstitutionCreateProps } from '@/components/Institutions/Institutions.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InstitutionsCreatePage({
    canSubmit,
}: InstitutionCreateProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Nova Instituição Base"
            subtitle="Defina o ponto central e as informações da sede para o mapa de barreiras."
            breadcrumbItems={institutionBreadcrumb({ current: 'Cadastrar' })}
            tour={institutionCreateTour}
        >
            <InstitutionForm canSubmit={canSubmit} />
        </BusinessPage>
    );
}
