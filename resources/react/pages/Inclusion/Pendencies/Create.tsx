import PendencyForm from '@/components/Inclusion/Pendencies/Form/PendencyForm';
import { pendencyBreadcrumb } from '@/components/Inclusion/Pendencies/Pendencies.routes';
import type { PendencyCreateProps } from '@/components/Inclusion/Pendencies/Pendencies.types';
import { pendencyCreateTour } from '@/components/Inclusion/Pendencies/pendencyTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionPendenciesCreatePage({
    professionals,
    priorities,
}: PendencyCreateProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Criar Nova Pendência"
            subtitle="Registre uma nova pendência e direcione-a a um profissional responsável."
            breadcrumbItems={pendencyBreadcrumb({ current: 'Cadastrar' })}
            tour={pendencyCreateTour}
        >
            <PendencyForm professionals={professionals} priorities={priorities} />
        </BusinessPage>
    );
}
