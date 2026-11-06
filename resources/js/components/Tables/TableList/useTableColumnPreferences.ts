import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { notifyOperationFailure } from '@/components/UI/NotificationToast/operationFeedback';
import {
    TABLE_LIST_COLUMNS_URL,
    tableListSignature,
    type TableListSharedPreferences,
} from './TableList.preferences';

type ColumnVisibility = Record<string, boolean>;

/**
 * Colunas visíveis lembradas por usuário e por tela. A chave combina a rota da tela com a
 * assinatura das colunas, para separar as tabelas de uma mesma tela. Cada escolha é gravada
 * no servidor e volta nas props compartilhadas na próxima visita.
 */
export function useTableColumnPreferences(columnIds: readonly string[]) {
    const { props } = usePage<{
        tablePreferences?: TableListSharedPreferences;
        impersonating?: boolean;
    }>();
    const preferences = props.tablePreferences;
    // Na personificação a escolha vale só na tela, sem alterar o usuário personificado.
    const persistent = !props.impersonating;
    const signature = columnIds.join(',');
    const key = preferences?.route
        ? `${preferences.route}#${tableListSignature(signature)}`
        : null;
    const saved = key ? preferences?.columns[key] : undefined;
    const savedRef = useRef(saved);
    savedRef.current = saved;
    const [visibility, setVisibility] = useState<ColumnVisibility>(saved ?? {});

    // Outra tela ou outro conjunto de colunas no mesmo componente: volta à escolha salva dele.
    useEffect(() => {
        setVisibility(savedRef.current ?? {});
    }, [key]);

    function persist(next: ColumnVisibility): void {
        if (!key || !persistent) return;

        const headers = { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' };

        axios.put(TABLE_LIST_COLUMNS_URL, { key, columns: next }, { headers }).catch(() => {
            notifyOperationFailure(
                'Não foi possível salvar a escolha de colunas. Ela vale até você sair da tela.',
            );
        });
    }

    function update(next: ColumnVisibility): void {
        setVisibility(next);
        persist(next);
    }

    return { visibility, update };
}
