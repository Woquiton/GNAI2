import PositionForm from '@/components/Positions/Form/PositionForm';
import { positionBreadcrumb } from '@/components/Positions/Positions.routes';
import type { PositionCreateProps } from '@/components/Positions/Positions.types';
import { positionCreateTour } from '@/components/Positions/positionTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function PositionsCreatePage({
    permissions,
}: PositionCreateProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Cadastrar Novo Cargo"
            subtitle="Defina as atribuições e o status do cargo no sistema."
            breadcrumbItems={positionBreadcrumb({ current: 'Cadastrar' })}
            tour={positionCreateTour}
        >
            <PositionForm permissions={permissions} />
        </BusinessPage>
    );
}
