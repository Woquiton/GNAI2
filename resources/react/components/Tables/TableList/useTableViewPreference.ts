import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { notifyOperationFailure } from '@/components/UI/NotificationToast/operationFeedback';
import {
    TABLE_LIST_VIEW_URL,
    type TableListSharedPreferences,
    type TableListViewMode,
} from './TableList.preferences';

interface ViewPreferencePageProps {
    tablePreferences?: TableListSharedPreferences;
    impersonating?: boolean;
    auth?: { user?: { id: number } | null };
    [key: string]: unknown;
}

/** Persiste o modo por operador e rota na mesma tabela das colunas e da paginação. */
export function useTableViewPreference() {
    const { props } = usePage<ViewPreferencePageProps>();
    const key = props.tablePreferences?.route;
    const userId = props.auth?.user?.id;
    const saved = props.tablePreferences?.viewMode ?? 'list';
    const savedRef = useRef(saved);
    savedRef.current = saved;
    const [view, setView] = useState<TableListViewMode>(saved);
    const pending = useRef<Promise<void>>(Promise.resolve());
    const lastSelection = useRef(0);

    useEffect(() => {
        setView(savedRef.current);
    }, [key, userId]);

    function selectView(next: TableListViewMode): void {
        setView(next);
        const selection = ++lastSelection.current;
        // Mantém também a página guardada pelo Inertia para o botão Voltar do navegador.
        function remember(): void {
            router.replaceProp<ViewPreferencePageProps>(
                'tablePreferences.viewMode',
                (old, current) =>
                    current.tablePreferences?.route === key && current.auth?.user?.id === userId
                        ? next
                        : old,
            );
        }
        if (key) remember();
        if (!key || props.impersonating) return;
        // A ordem das gravações acompanha os cliques, mesmo com uma conexão lenta.
        pending.current = pending.current.then(async () => {
            try {
                await axios.put(
                    TABLE_LIST_VIEW_URL,
                    { key, view_mode: next },
                    {
                        headers: {
                            Accept: 'application/json',
                            'X-Requested-With': 'XMLHttpRequest',
                        },
                    },
                );
                if (selection === lastSelection.current) remember();
            } catch {
                notifyOperationFailure(
                    'Não foi possível salvar a visualização. A escolha vale somente nesta visita.',
                );
            }
        });
    }

    return { view, selectView };
}
