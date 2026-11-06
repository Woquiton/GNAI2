import type { ReactNode } from 'react';
import Button, { type ButtonTone } from '@/components/UI/Button/Button';
import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';
import { PEI_ACTION_FAILURE_TEXT } from './Peis.constants';

interface PeiConfirmActionProps {
    method: 'delete' | 'patch';
    action: string;
    label: string;
    ariaLabel: string;
    tone: ButtonTone;
    iconClass: string;
    modalTitle: string;
    message: ReactNode;
    confirmLabel: string;
    processingLabel: string;
    confirmTone?: ButtonTone;
}

/** Ação do rodapé do PEI que muda estado ou exclui, sempre confirmada antes do envio. */
export default function PeiConfirmAction({
    method,
    action,
    label,
    ariaLabel,
    tone,
    iconClass,
    modalTitle,
    message,
    confirmLabel,
    processingLabel,
    confirmTone = tone,
}: PeiConfirmActionProps): React.JSX.Element {
    const confirmation = useConfirmedAction<string>({ failureText: PEI_ACTION_FAILURE_TEXT });

    return (
        <>
            <Button
                type="button"
                tone={tone}
                leftIconClass={iconClass}
                label={label}
                title={ariaLabel}
                aria-label={ariaLabel}
                disabled={confirmation.processing}
                onClick={() => confirmation.open(action)}
            />
            <ConfirmActionModal
                open={confirmation.target !== null}
                title={modalTitle}
                message={message}
                processing={confirmation.processing}
                confirmLabel={confirmLabel}
                processingLabel={processingLabel}
                confirmTone={confirmTone}
                onClose={confirmation.close}
                onConfirm={() => {
                    if (confirmation.target) confirmation.submit(method, confirmation.target);
                }}
            />
        </>
    );
}
