import PositionForm from '@/components/Inclusion/Positions/Form/PositionForm';
import { positionBreadcrumb } from '@/components/Inclusion/Positions/Positions.routes';
import type { PositionCreateProps } from '@/components/Inclusion/Positions/Positions.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionPositionsCreatePage({
    permissions,
}: PositionCreateProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Cadastrar Novo Cargo"
            subtitle="Defina as atribuições e o status do cargo no sistema."
            breadcrumbItems={positionBreadcrumb({ current: 'Cadastrar' })}
        >
            <PositionForm permissions={permissions} />
        </BusinessPage>
    );
}
