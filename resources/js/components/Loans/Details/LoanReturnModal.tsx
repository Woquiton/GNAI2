import { useState } from 'react';
import ChoiceControl from '@/components/Forms/ChoiceControl/ChoiceControl';
import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';

interface LoanReturnModalProps {
    open: boolean;
    processing: boolean;
    onClose: () => void;
    /** Envia a devolução com a indicação de avaria (`is_damaged`). */
    onConfirm: (damaged: boolean) => void;
}

/** Confirmação da devolução ao acervo, com a opção de registrar avarias. */
export default function LoanReturnModal({
    open,
    processing,
    onClose,
    onConfirm,
}: LoanReturnModalProps): React.JSX.Element {
    const [damaged, setDamaged] = useState(false);
    const [wasOpen, setWasOpen] = useState(open);

    // Cada abertura começa sem avaria marcada.
    if (open !== wasOpen) {
        setWasOpen(open);

        if (open) {
            setDamaged(false);
        }
    }

    return (
        <ConfirmActionModal
            open={open}
            title="Confirmar Devolução"
            message="Confirme a devolução deste recurso ao acervo."
            details={
                <ChoiceControl
                    type="checkbox"
                    id="loan-return-damaged"
                    name="is_damaged"
                    tone="danger"
                    label="Item devolvido com avarias ou danos"
                    checked={damaged}
                    disabled={processing}
                    onChange={setDamaged}
                />
            }
            processing={processing}
            confirmLabel="Confirmar devolução"
            processingLabel="Registrando devolução..."
            confirmTone="success"
            onClose={onClose}
            onConfirm={() => onConfirm(damaged)}
        />
    );
}
