import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';
import { peiDisplayName } from './Peis.constants';
import type { PeiListRecord } from './Peis.types';

interface PeiDeleteModalProps {
    pei: PeiListRecord | null;
    processing: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

/** Confirmação de exclusão das listagens de PEIs. */
export default function PeiDeleteModal({
    pei,
    processing,
    onClose,
    onConfirm,
}: PeiDeleteModalProps): React.JSX.Element {
    return (
        <ConfirmActionModal
            open={pei !== null}
            title="Excluir PEI"
            message="Deseja remover este PEI?"
            details={pei ? <strong>{peiDisplayName(pei)}</strong> : undefined}
            processing={processing}
            confirmLabel="Confirmar exclusão"
            processingLabel="Excluindo PEI..."
            confirmTone="dark-red"
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );
}
