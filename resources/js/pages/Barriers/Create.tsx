import { barrierBreadcrumb } from '@/components/Barriers/Barriers.routes';
import type { BarrierCreateProps } from '@/components/Barriers/Barriers.types';
import { barrierCreateTour } from '@/components/Barriers/barrierTours';
import BarrierForm from '@/components/Barriers/Form/BarrierForm';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function BarriersCreatePage(
    options: BarrierCreateProps,
): React.JSX.Element {
    return (
        <BusinessPage
            title="Relatar Barreira de Acessibilidade"
            subtitle="Registre um ponto de obstrução ou dificuldade encontrada no campus."
            breadcrumbItems={barrierBreadcrumb({ current: 'Cadastrar' })}
            tour={barrierCreateTour}
        >
            <BarrierForm options={options} />
        </BusinessPage>
    );
}
