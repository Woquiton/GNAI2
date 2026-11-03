import InstitutionForm from '@/components/Inclusion/Institutions/Form/InstitutionForm';
import { institutionCreateTour } from '@/components/Inclusion/Institutions/institutionTours';
import { institutionBreadcrumb } from '@/components/Inclusion/Institutions/Institutions.routes';
import type { InstitutionCreateProps } from '@/components/Inclusion/Institutions/Institutions.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionInstitutionsCreatePage({
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
