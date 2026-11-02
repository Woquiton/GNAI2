import PositionDetails from '@/components/Inclusion/Positions/Details/PositionDetails';
import PositionDetailsActions from '@/components/Inclusion/Positions/Details/PositionDetailsActions';
import PositionDeleteModal from '@/components/Inclusion/Positions/PositionDeleteModal';
import {
    positionBreadcrumb,
    positionUrls,
} from '@/components/Inclusion/Positions/Positions.routes';
import type { PositionShowProps } from '@/components/Inclusion/Positions/Positions.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function InclusionPositionsShowPage({
    position,
    descriptionHtml,
    can,
}: PositionShowProps): React.JSX.Element {
    const removal = useConfirmedAction<typeof position>({
        failureText: 'Não foi possível excluir o cargo. Tente novamente.',
    });
    const busy = removal.processing;

    return (
        <BusinessPage
            title="Detalhes do Cargo"
            subtitle="Gerenciamento de funções e atribuições do suporte especializado."
            documentTitle={position.name}
            breadcrumbItems={positionBreadcrumb({ position })}
            busy={busy}
        >
            <PositionDetails position={position} descriptionHtml={descriptionHtml} />
            <PositionDetailsActions
                positionId={position.id}
                permissions={can}
                busy={busy}
                onDelete={() => removal.open(position)}
            />
            <PositionDeleteModal
                position={removal.target}
                warnLinkedProfessionals
                processing={removal.processing}
                onClose={removal.close}
                onConfirm={() => removal.submit('delete', positionUrls.destroy(position.id))}
            />
        </BusinessPage>
    );
}
