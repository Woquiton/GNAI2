import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';
import type { PublicationRecord } from './Publications.types';
export default function PublicationDeleteModal({
    publication,
    processing,
    onClose,
    onConfirm,
}: {
    publication: PublicationRecord | null;
    processing: boolean;
    onClose: () => void;
    onConfirm: () => void;
}): React.JSX.Element {
    return (
        <ConfirmActionModal
            open={publication !== null}
            title="Excluir Publicação"
            message={
                <>
                    A publicação <strong>{publication?.title}</strong> será excluída
                    permanentemente, com sua capa e galeria.
                </>
            }
            processing={processing}
            confirmLabel="Confirmar exclusão"
            processingLabel="Excluindo publicação..."
            confirmTone="dark-red"
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );
}
