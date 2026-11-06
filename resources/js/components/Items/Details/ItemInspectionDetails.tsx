import InspectionDetails from '@/components/Inspections/InspectionDetails/InspectionDetails';
import type { InspectionEvidence } from '@/components/Inspections/InspectionEvidenceCarousel/InspectionEvidenceCarousel.types';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';
import { itemUrls } from '../Items.routes';
import type { ItemInspectionShowProps } from '../Items.types';
import ItemCoverModal from './ItemCoverModal';

export default function ItemInspectionDetails({
    item,
    inspection,
    cover,
    canSetCover,
}: ItemInspectionShowProps): React.JSX.Element {
    const favorite = useConfirmedAction<InspectionEvidence>({
        failureText: 'Não foi possível definir a imagem favorita. Tente novamente.',
    });

    function confirmCover(): void {
        if (!favorite.target) return;
        favorite.submit('put', itemUrls.setCover(item.id, favorite.target.id), {
            expected_cover_evidence_id: cover?.id ?? '',
        });
    }

    return (
        <>
            <InspectionDetails
                inspection={inspection}
                subject={{ name: item.name, href: itemUrls.show(item.id) }}
                favorite={{
                    selectedId: cover?.id ?? null,
                    disabled: favorite.processing,
                    onSelect: canSetCover ? favorite.open : undefined,
                }}
            />
            <ItemCoverModal
                current={cover}
                candidate={favorite.target}
                processing={favorite.processing}
                onClose={favorite.close}
                onConfirm={confirmCover}
            />
        </>
    );
}
