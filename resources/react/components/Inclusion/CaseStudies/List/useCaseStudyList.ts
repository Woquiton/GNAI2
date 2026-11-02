import { usePage } from '@inertiajs/react';
import { useTableListFilters } from '@/components/Tables/TableList/TableList';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';
import {
    caseStudyFailureTexts,
    caseStudyName,
    emptyCaseStudyFilters,
} from '../CaseStudies.constants';
import { caseStudyUrls } from '../CaseStudies.routes';
import type { CaseStudyListFilters, CaseStudyRow } from '../CaseStudies.types';

interface UseCaseStudyListOptions {
    initialFilters: Partial<CaseStudyListFilters>;
}

/** Filtros, paginação e exclusão confirmada da listagem geral de Estudos de Caso. */
export function useCaseStudyList({ initialFilters }: UseCaseStudyListOptions) {
    const errors = usePage().props.errors as Record<string, string | undefined>;
    const filters = useTableListFilters({
        url: caseStudyUrls.all,
        initialFilters,
        emptyFilters: emptyCaseStudyFilters,
        failureText: caseStudyFailureTexts.list,
    });
    const removal = useConfirmedAction<CaseStudyRow>({
        failureText: caseStudyFailureTexts.delete,
    });

    function rowName(caseStudy: CaseStudyRow): string {
        return caseStudyName({ version: caseStudy.version, student: caseStudy.student });
    }

    function openRemoval(caseStudy: CaseStudyRow): void {
        filters.cancelScheduled();
        removal.open(caseStudy);
    }

    function confirmRemoval(): void {
        if (removal.target) {
            filters.cancelScheduled();
            removal.submit('delete', caseStudyUrls.destroy(removal.target.id));
        }
    }

    return {
        errors,
        filters,
        rowName,
        removal: {
            open: removal.target !== null,
            name: removal.target ? rowName(removal.target) : null,
            processing: removal.processing,
            request: openRemoval,
            close: removal.close,
            confirm: confirmRemoval,
        },
    };
}
