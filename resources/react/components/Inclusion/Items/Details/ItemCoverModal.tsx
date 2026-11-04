import type { InspectionEvidence } from '@/components/Inclusion/Inspections/InspectionEvidenceCarousel/InspectionEvidenceCarousel.types';
import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';
import type { ItemCoverImage } from '../Items.types';
import './ItemCoverModal.css';

interface ItemCoverModalProps {
    current: ItemCoverImage | null;
    candidate: InspectionEvidence | null;
    processing: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function ItemCoverModal({
    current,
    candidate,
    processing,
    onClose,
    onConfirm,
}: ItemCoverModalProps): React.JSX.Element {
    const message = current
        ? 'Já existe uma imagem favorita usada como capa deste item. Deseja substituir pela imagem selecionada?'
        : 'Deseja favoritar esta imagem e utilizá-la como capa do item no catálogo?';

    return (
        <ConfirmActionModal
            open={candidate !== null}
            title={current ? 'Substituir imagem favorita e capa' : 'Definir imagem favorita e capa'}
            message={message}
            confirmLabel="Usar como favorita e capa"
            processingLabel="Salvando capa"
            confirmTone="list-action"
            processing={processing}
            onClose={onClose}
            onConfirm={onConfirm}
            details={
                candidate ? (
                    <div className="itemCoverComparison">
                        {current ? (
                            <figure>
                                <img src={current.url} alt={`Capa atual: ${current.name}`} />
                                <figcaption>Favorita e capa atual: {current.name}</figcaption>
                            </figure>
                        ) : null}
                        <figure>
                            <img src={candidate.url} alt={`Nova capa: ${candidate.name}`} />
                            <figcaption>
                                {current ? 'Nova favorita e capa' : 'Imagem selecionada'}:{' '}
                                {candidate.name}
                            </figcaption>
                        </figure>
                    </div>
                ) : null
            }
        />
    );
}
