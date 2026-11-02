import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';
import { notifyConnectionFailure, notifyOperationFailure } from '@/components/UI/NotificationToast/operationFeedback';
import { compactListFilters } from '@/hooks/useAutoListFilters';

type QueryValue = string | number;

interface TableListVisitOptions {
    /** Endereço da listagem. */
    url: string;
    /** Mensagem do toast quando o servidor falha ao atualizar a listagem. */
    failureText: string;
    /** Nome do parâmetro de página, quando o controller usa outro (ex.: `pedagogical_page`). */
    pageParam?: string;
}

/**
 * Recarga das listagens por visitas Inertia: filtros, paginação e limpeza.
 *
 * Uma visita nova cancela a anterior, para o filtro digitado durante uma requisição não ser descartado. Os
 * campos não ficam bloqueados durante a recarga; `loading` alimenta `TableListCard.loading` e a paginação.
 */
export function useTableListVisit({ url, failureText, pageParam = 'page' }: TableListVisitOptions) {
    const [loading, setLoading] = useState(false);
    const cancelCurrent = useRef<(() => void) | undefined>(undefined);

    useEffect(() => () => cancelCurrent.current?.(), []);

    function visitUrl(target: string, data: Record<string, QueryValue> = {}): void {
        cancelCurrent.current?.();
        router.get(target, data, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
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
                cancelCurrent.current = undefined;
                setLoading(false);
            },
        });
    }

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
