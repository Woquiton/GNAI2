import PositionForm from '@/components/Positions/Form/PositionForm';
import { positionBreadcrumb } from '@/components/Positions/Positions.routes';
import type { PositionEditProps } from '@/components/Positions/Positions.types';
import { positionEditTour } from '@/components/Positions/positionTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function PositionsEditPage({
    position,
    permissions,
}: PositionEditProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Editar Cargo"
            subtitle={`Alterando informações do cargo: ${position.name}`}
            breadcrumbItems={positionBreadcrumb({ position, current: 'Editar' })}
            tour={positionEditTour}
        >
            <PositionForm key={position.id} position={position} permissions={permissions} />
        </BusinessPage>
    );
}
