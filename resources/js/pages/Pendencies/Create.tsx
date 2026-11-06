import PendencyForm from '@/components/Pendencies/Form/PendencyForm';
import { pendencyBreadcrumb } from '@/components/Pendencies/Pendencies.routes';
import type { PendencyCreateProps } from '@/components/Pendencies/Pendencies.types';
import { pendencyCreateTour } from '@/components/Pendencies/pendencyTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function PendenciesCreatePage({
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
