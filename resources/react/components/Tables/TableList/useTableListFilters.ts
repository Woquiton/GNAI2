import { useMemo } from 'react';
import useAutoListFilters from '@/hooks/useAutoListFilters';
import { useTableListVisit } from './useTableListRequest';

interface TableListFiltersOptions<T extends Record<string, string>> {
    /** Endereço da listagem. */
    url: string;
    /** Filtros recebidos do controller; os ausentes assumem os valores vazios. */
    initialFilters: Partial<T> | undefined;
    emptyFilters: T;
    /** Mensagem do toast quando o servidor falha ao atualizar a listagem. */
    failureText: string;
    /** Nome do parâmetro de página, quando o controller usa outro. */
    pageParam?: string;
}

/**
 * Estado completo de uma listagem com filtros: valores, busca automática com atraso, limpeza,
 * paginação e indicador de carregamento. Combina `useAutoListFilters` e `useTableListVisit`.
 */
export function useTableListFilters<T extends Record<string, string>>({
    url,
    initialFilters,
    emptyFilters,
    failureText,
    pageParam,
}: TableListFiltersOptions<T>) {
    const list = useTableListVisit({ url, failureText, pageParam });
    const initialValues = useMemo(
        () => ({ ...emptyFilters, ...initialFilters }) as T,
        // `emptyFilters` é uma constante do módulo; os filtros mudam a cada resposta da listagem.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [initialFilters],
    );
    const filters = useAutoListFilters({
        initialValues,
        emptyValues: emptyFilters,
        onSearch: (values: T) => list.visit(values),
    });

    /** Troca de página preservando os filtros e parâmetros atuais da URL. */
    function selectPage(page: number): void {
        filters.cancelScheduled();
        const params = new URLSearchParams(window.location.search);
        params.set(pageParam ?? 'page', String(page));
        list.visitUrl(`${url}?${params.toString()}`);
    }

    return {
        values: filters.values,
        update: filters.update,
        clear: filters.clear,
        submit: filters.submit,
        cancelScheduled: filters.cancelScheduled,
        loading: list.loading,
        visit: list.visit,
        selectPage,
    };
}
