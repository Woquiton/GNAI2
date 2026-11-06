import { router } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { notifyConnectionFailure, notifyOperationFailure } from '@/components/UI/NotificationToast/operationFeedback';

type QueryValue = string | number | boolean;

export interface ConfirmedActionOptions {
    /** Mensagem do toast quando o servidor falha ao executar a ação. */
    failureText: string;
}

/**
 * Ação que exige confirmação (excluir, ativar, concluir) sobre um registro.
 *
 * Guarda o registro escolhido para o `ConfirmActionModal`, impede envio duplicado e apresenta
 * falhas no toast. O sucesso vem do redirect com `flash` do backend. Usado tanto nas listagens
 * quanto nas telas de visualização.
 */
export function useConfirmedAction<T>({ failureText }: ConfirmedActionOptions) {
    const [target, setTarget] = useState<T | null>(null);
    const [processing, setProcessing] = useState(false);
    const pending = useRef(false);

    function open(item: T): void {
        setTarget(item);
    }

    function close(): void {
        if (!pending.current) {
            setTarget(null);
        }
    }

    function submit(
        method: 'delete' | 'patch' | 'post' | 'put',
        url: string,
        data: Record<string, QueryValue> = {},
    ): void {
        if (pending.current) {
            return;
        }

        pending.current = true;
        setProcessing(true);
        router.visit(url, {
            method,
            data,
            preserveScroll: true,
            onNetworkError: () => {
                notifyConnectionFailure();
                return false;
            },
            onHttpException: () => {
                notifyOperationFailure(failureText);
                return false;
            },
            onSuccess: () => setTarget(null),
            onFinish: () => {
                pending.current = false;
                setProcessing(false);
            },
        });
    }

    return { target, processing, open, close, submit };
}
