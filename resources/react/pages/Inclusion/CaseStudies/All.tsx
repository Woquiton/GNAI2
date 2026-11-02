import { caseStudyAllBreadcrumb } from '@/components/Inclusion/CaseStudies/CaseStudies.routes';
import type { CaseStudyListProps } from '@/components/Inclusion/CaseStudies/CaseStudies.types';
import CaseStudyDeleteModal from '@/components/Inclusion/CaseStudies/CaseStudyDeleteModal';
import CaseStudyFilters from '@/components/Inclusion/CaseStudies/List/CaseStudyFilters';
import CaseStudyList from '@/components/Inclusion/CaseStudies/List/CaseStudyList';
import { useCaseStudyList } from '@/components/Inclusion/CaseStudies/List/useCaseStudyList';
import { TableListLayout } from '@/components/Tables/TableList/TableList';

export default function InclusionCaseStudiesAllPage({
    caseStudies,
    semesters,
    statuses,
    filters: initialFilters,
    can,
}: CaseStudyListProps): React.JSX.Element {
    const { errors, filters, rowName, removal } = useCaseStudyList({
        student: null,
        initialFilters,
    });

    return (
        <TableListLayout
            title="Estudos de Caso"
            subtitle="Primeira etapa da cadeia Estudo de Caso → PAEE → PEI (Decreto 12.686/2025)."
            breadcrumbItems={caseStudyAllBreadcrumb()}
            listLabel="Listagem geral de Estudos de Caso"
            loading={filters.loading}
            loadingLabel="Atualizando Estudos de Caso"
            filters={
                <CaseStudyFilters
                    values={filters.values}
                    semesters={semesters}
                    statuses={statuses}
                    showSearch
                    errors={errors}
                    onUpdate={filters.update}
                    onClear={filters.clear}
                    onSubmit={filters.submit}
                />
            }
            dialogs={
                <CaseStudyDeleteModal
                    open={removal.open}
                    name={removal.name}
                    processing={removal.processing}
                    onClose={removal.close}
                    onConfirm={removal.confirm}
                />
            }
        >
            <CaseStudyList
                caseStudies={caseStudies}
                byStudent={false}
                permissions={can}
                loading={filters.loading}
                processing={removal.processing}
                rowName={rowName}
                onDelete={removal.request}
                onPageSelect={filters.selectPage}
            />
        </TableListLayout>
    );
}
