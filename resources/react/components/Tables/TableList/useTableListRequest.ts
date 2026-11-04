import { router } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';
import {
    notifyConnectionFailure,
    notifyOperationFailure,
} from '@/components/UI/NotificationToast/operationFeedback';
import { compactListFilters } from '@/hooks/useAutoListFilters';

type QueryValue = string | number;

interface TableListVisitOptions {
    /** Endereço da listagem. */
    url: string;
    /** Mensagem do toast quando o servidor falha ao atualizar a listagem. */
    failureText: string;
    /** Nome do parâmetro de página, quando o controller usa outro (ex.: `pedagogical_page`). */
    pageParam?: string;
    /** Atualização parcial em segundo plano, suspensa durante visitas do usuário. */
    polling?: { enabled: boolean; only: string[]; interval?: number };
}

/**
 * Recarga das listagens por visitas Inertia: filtros, paginação e limpeza.
 *
 * Uma visita nova cancela a anterior, para o filtro digitado durante uma requisição não ser descartado. Os
 * campos não ficam bloqueados durante a recarga; `loading` alimenta `TableListCard.loading` e a paginação.
 */
export function useTableListVisit({
    url,
    failureText,
    pageParam = 'page',
    polling,
}: TableListVisitOptions) {
    const [loading, setLoading] = useState(false);
    const cancelCurrent = useRef<(() => void) | undefined>(undefined);
    const requestId = useRef(0);
    const backgroundRequest = useRef(false);
    const foregroundVisits = useRef(new Set<unknown>());

    const pollingEnabled = polling?.enabled ?? false;
    const pollingOnly = polling?.only;
    const pollingInterval = polling?.interval ?? 5000;

    useEffect(() => {
        const stopStart = router.on('start', (event) => {
            if (event.detail.visit.async || event.detail.visit.prefetch) return;
            foregroundVisits.current.add(event.detail.visit);
            if (backgroundRequest.current) cancelCurrent.current?.();
        });
        const stopFinish = router.on('finish', (event) => {
            foregroundVisits.current.delete(event.detail.visit);
        });

        return () => {
            stopStart();
            stopFinish();
            cancelCurrent.current?.();
        };
    }, []);

    const visitUrl = useCallback(
        (target: string, data: Record<string, QueryValue> = {}, only?: string[]): void => {
            cancelCurrent.current?.();
            const currentRequest = ++requestId.current;
            backgroundRequest.current = Boolean(only);
            router.get(target, data, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                ...(only ? { only, async: true, showProgress: false } : {}),
                onCancelToken: (token) => {
                    cancelCurrent.current = () => token.cancel();
                },
                onStart: () => setLoading(true),
                onNetworkError: () => {
                    notifyConnectionFailure();
                    return false;
                },
                onHttpException: () => {
                    notifyOperationFailure(failureText);
                    return false;
                },
                onFinish: () => {
                    if (currentRequest !== requestId.current) return;
                    cancelCurrent.current = undefined;
                    setLoading(false);
                },
            });
        },
        [failureText],
    );

    useEffect(() => {
        if (!pollingEnabled || !pollingOnly?.length) return;

        const timer = window.setInterval(() => {
            if (document.hidden || foregroundVisits.current.size > 0 || cancelCurrent.current) return;
            visitUrl(window.location.href, {}, pollingOnly);
        }, pollingInterval);

        return () => {
            window.clearInterval(timer);
            if (backgroundRequest.current) cancelCurrent.current?.();
        };
    }, [pollingEnabled, pollingOnly, pollingInterval, visitUrl]);

    /** Recarrega a listagem com os filtros (sem os vazios) e a página pedida. */
    function visit(
        filters: Record<string, string> = {},
        page = 1,
        extra: Record<string, QueryValue> = {},
    ): void {
        visitUrl(url, {
            ...(compactListFilters(filters) as Record<string, string>),
            ...extra,
            ...(page > 1 ? { [pageParam]: page } : {}),
        });
    }

    function cancel(): void {
        cancelCurrent.current?.();
    }

    return { loading, visit, visitUrl, cancel };
}

/**
 * Ação confirmada sobre um registro da listagem. Mantido como alias de `useConfirmedAction` para as
 * listagens existentes.
 */
export const useTableListAction = useConfirmedAction;
