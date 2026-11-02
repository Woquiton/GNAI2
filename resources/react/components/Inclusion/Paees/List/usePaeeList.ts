import { usePage } from '@inertiajs/react';
import { useTableListFilters } from '@/components/Tables/TableList/TableList';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';
import { emptyPaeeFilters, paeeFailureTexts, paeeName } from '../Paees.constants';
import { paeeUrls } from '../Paees.routes';
import type { PaeeListFilters, PaeeListRecord } from '../Paees.types';

interface UsePaeeListOptions {
    /** Endereço da listagem (geral ou do aluno). */
    url: string;
    initialFilters: Partial<PaeeListFilters>;
}

/** Filtros, paginação e exclusão confirmada compartilhados pelas listagens de PAEE. */
export function usePaeeList({ url, initialFilters }: UsePaeeListOptions) {
    const errors = usePage().props.errors as Record<string, string | undefined>;
    const filters = useTableListFilters({
        url,
        initialFilters,
        emptyFilters: emptyPaeeFilters,
        failureText: paeeFailureTexts.list,
    });
    const removal = useConfirmedAction<PaeeListRecord>({
        failureText: paeeFailureTexts.delete,
    });

    function openRemoval(paee: PaeeListRecord): void {
        filters.cancelScheduled();
        removal.open(paee);
    }

    function confirmRemoval(): void {
        if (removal.target) {
            filters.cancelScheduled();
            removal.submit('delete', paeeUrls.destroy(removal.target.id));
        }
    }

    return {
        errors,
        filters,
        removal: {
            name: removal.target ? paeeName(removal.target) : null,
            processing: removal.processing,
            open: openRemoval,
            close: removal.close,
            confirm: confirmRemoval,
        },
    };
}
