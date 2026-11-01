import { useState } from 'react';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';
import { sessionDeleteFailureText } from './Sessions.constants';
import { sessionUrls } from './Sessions.routes';
import type { SessionRemovalTarget } from './Sessions.types';

/**
 * Exclusão confirmada de um agendamento. Agendamentos ainda agendados perguntam se os
 * participantes devem receber e-mail (`send_notification`); os demais não enviam o campo.
 */
export function useSessionRemoval<T extends SessionRemovalTarget>() {
    const removal = useConfirmedAction<T>({ failureText: sessionDeleteFailureText });
    const [sendNotification, setSendNotification] = useState(false);

    function open(session: T): void {
        setSendNotification(false);
        removal.open(session);
    }

    function confirm(): void {
        if (!removal.target) {
            return;
        }

        removal.submit(
            'delete',
            sessionUrls.destroy(removal.target.id),
            removal.target.is_scheduled ? { send_notification: sendNotification ? 1 : 0 } : {},
        );
    }

    return {
        target: removal.target,
        processing: removal.processing,
        sendNotification,
        setSendNotification,
        open,
        close: removal.close,
        confirm,
    };
}

export type SessionRemoval = ReturnType<typeof useSessionRemoval>;
