import { usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import { useTableListFilters } from '@/components/Tables/TableList/TableList';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';
import {
    caseStudyFailureTexts,
    caseStudyName,
    emptyCaseStudyFilters,
} from '../CaseStudies.constants';
import { caseStudyUrls } from '../CaseStudies.routes';
import type { CaseStudyListFilters, CaseStudyRow, CaseStudyStudent } from '../CaseStudies.types';

interface UseCaseStudyListOptions {
    /** Aluno da listagem do prontuário; `null` na listagem geral. */
    student: CaseStudyStudent | null;
    initialFilters: Partial<CaseStudyListFilters>;
}

/** Filtros, paginação e exclusão confirmada compartilhados pelas listagens de Estudos de Caso. */
export function useCaseStudyList({ student, initialFilters }: UseCaseStudyListOptions) {
    const errors = usePage().props.errors as Record<string, string | undefined>;
    // A listagem do aluno não filtra por nome; a busca nunca é enviada nela.
    const studentFilters = useMemo(
        () => (student ? { ...initialFilters, search: '' } : initialFilters),
        [student, initialFilters],
    );
    const filters = useTableListFilters({
        url: student ? caseStudyUrls.student(student.id) : caseStudyUrls.all,
        initialFilters: studentFilters,
        emptyFilters: emptyCaseStudyFilters,
        failureText: caseStudyFailureTexts.list,
    });
    const removal = useConfirmedAction<CaseStudyRow>({
        failureText: caseStudyFailureTexts.delete,
    });

    /** Nome acessível da linha; na listagem do aluno, o dono vem do prontuário. */
    function rowName(caseStudy: CaseStudyRow): string {
        return caseStudyName({ version: caseStudy.version, student: caseStudy.student ?? student });
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
