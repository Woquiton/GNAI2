import { usePage } from '@inertiajs/react';
import { useTableListFilters } from '@/components/Tables/TableList/TableList';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';
import { emptyPeiFilters, PEI_LIST_FAILURE_TEXT, PEI_DELETE_FAILURE_TEXT } from '../Peis.constants';
import { peiUrls } from '../Peis.routes';
import type { PeiListFilters, PeiListRecord } from '../Peis.types';

interface UsePeiListOptions {
    /** Endereço da listagem (geral ou do aluno). */
    url: string;
    initialFilters: Partial<PeiListFilters>;
}

/** Filtros, paginação e exclusão confirmada compartilhados pelas listagens de PEI. */
export function usePeiList({ url, initialFilters }: UsePeiListOptions) {
    const errors = usePage().props.errors as Record<string, string | undefined>;
    const filters = useTableListFilters({
        url,
        initialFilters,
        emptyFilters: emptyPeiFilters,
        failureText: PEI_LIST_FAILURE_TEXT,
    });
    const removal = useConfirmedAction<PeiListRecord>({
        failureText: PEI_DELETE_FAILURE_TEXT,
    });

    function openRemoval(pei: PeiListRecord): void {
        filters.cancelScheduled();
        removal.open(pei);
    }

    function confirmRemoval(): void {
        if (removal.target) {
            filters.cancelScheduled();
            removal.submit('delete', peiUrls.destroy(removal.target.id));
        }
    }

    return {
        errors,
        filters,
        removal: {
            target: removal.target,
            processing: removal.processing,
            open: openRemoval,
            close: removal.close,
            confirm: confirmRemoval,
        },
    };
}
