import InstitutionForm from '@/components/Inclusion/Institutions/Form/InstitutionForm';
import { institutionEditTour } from '@/components/Inclusion/Institutions/institutionTours';
import { institutionBreadcrumb } from '@/components/Inclusion/Institutions/Institutions.routes';
import type { InstitutionEditProps } from '@/components/Inclusion/Institutions/Institutions.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionInstitutionsEditPage({
    institution,
    canSubmit,
}: InstitutionEditProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Editar Instituição Base"
            subtitle="Atualize a localização central ou as informações da sede para o mapa de barreiras."
            breadcrumbItems={institutionBreadcrumb({ institution, current: 'Editar' })}
            tour={institutionEditTour}
        >
            <InstitutionForm key={institution.id} institution={institution} canSubmit={canSubmit} />
        </BusinessPage>
    );
}
