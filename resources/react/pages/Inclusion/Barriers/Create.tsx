import { barrierBreadcrumb } from '@/components/Inclusion/Barriers/Barriers.routes';
import type { BarrierCreateProps } from '@/components/Inclusion/Barriers/Barriers.types';
import BarrierForm from '@/components/Inclusion/Barriers/Form/BarrierForm';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionBarriersCreatePage(
    options: BarrierCreateProps,
): React.JSX.Element {
    return (
        <BusinessPage
            title="Relatar Barreira de Acessibilidade"
            subtitle="Registre um ponto de obstrução ou dificuldade encontrada no campus."
            breadcrumbItems={barrierBreadcrumb({ current: 'Cadastrar' })}
        >
            <BarrierForm options={options} />
        </BusinessPage>
    );
}
