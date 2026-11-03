import PositionForm from '@/components/Inclusion/Positions/Form/PositionForm';
import { positionBreadcrumb } from '@/components/Inclusion/Positions/Positions.routes';
import type { PositionEditProps } from '@/components/Inclusion/Positions/Positions.types';
import { positionEditTour } from '@/components/Inclusion/Positions/positionTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionPositionsEditPage({
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
