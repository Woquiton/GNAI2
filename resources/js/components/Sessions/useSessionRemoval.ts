import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';
import { sessionDeleteFailureText } from './Sessions.constants';
import { sessionUrls } from './Sessions.routes';
import type { SessionRemovalTarget } from './Sessions.types';

/** Exclusão confirmada de um agendamento. */
export function useSessionRemoval<T extends SessionRemovalTarget>() {
    const removal = useConfirmedAction<T>({ failureText: sessionDeleteFailureText });

    function confirm(): void {
        if (!removal.target) {
            return;
        }

        removal.submit('delete', sessionUrls.destroy(removal.target.id));
    }

    return {
        target: removal.target,
        processing: removal.processing,
        open: removal.open,
        close: removal.close,
        confirm,
    };
}

export type SessionRemoval = ReturnType<typeof useSessionRemoval>;
