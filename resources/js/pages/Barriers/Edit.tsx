import { barrierBreadcrumb } from '@/components/Barriers/Barriers.routes';
import type { BarrierEditProps } from '@/components/Barriers/Barriers.types';
import { barrierEditTour } from '@/components/Barriers/barrierTours';
import BarrierForm from '@/components/Barriers/Form/BarrierForm';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function BarriersEditPage({
    barrier,
    ...options
}: BarrierEditProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Editar Barreira de Acessibilidade"
            subtitle={`Atualizando informações de ${barrier.name}.`}
            breadcrumbItems={barrierBreadcrumb({ barrier, current: 'Editar' })}
            tour={barrierEditTour}
        >
            <BarrierForm key={barrier.id} options={options} barrier={barrier} />
        </BusinessPage>
    );
}
