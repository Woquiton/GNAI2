import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import { sessionCancelFailureText } from '../Sessions.constants';
import { sessionUrls } from '../Sessions.routes';

/** Cancelamento do agendamento (`POST cancelar`) com motivo obrigatório. */
export function useSessionCancellation(sessionId: number, blocked: boolean) {
    const [isOpen, setOpen] = useState(false);
    const form = useForm({ cancellation_reason: '' });
    const submission = useFormSubmission(form);

    function open(): void {
        if (blocked || form.processing) {
            return;
        }

        form.reset();
        form.clearErrors();
        setOpen(true);
    }

    function close(): void {
        if (!form.processing) {
            setOpen(false);
        }
    }

    function confirm(): void {
        submission.submit({
            url: sessionUrls.cancel(sessionId),
            blocked,
            failureText: sessionCancelFailureText,
            options: {
                onSuccess: () => {
                    setOpen(false);
                    form.reset();
                },
            },
        });
    }

    return { isOpen, form, open, close, confirm };
}

export type SessionCancellation = ReturnType<typeof useSessionCancellation>;
