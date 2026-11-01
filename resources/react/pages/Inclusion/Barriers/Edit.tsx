import { barrierBreadcrumb } from '@/components/Inclusion/Barriers/Barriers.routes';
import type { BarrierEditProps } from '@/components/Inclusion/Barriers/Barriers.types';
import BarrierForm from '@/components/Inclusion/Barriers/Form/BarrierForm';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionBarriersEditPage({
    barrier,
    ...options
}: BarrierEditProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Editar Barreira de Acessibilidade"
            subtitle={`Atualizando informações de ${barrier.name}.`}
            breadcrumbItems={barrierBreadcrumb({ barrier, current: 'Editar' })}
        >
            <BarrierForm key={barrier.id} options={options} barrier={barrier} />
        </BusinessPage>
    );
}
