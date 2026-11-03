import PeiFilters from '@/components/Inclusion/Peis/List/PeiFilters';
import PeiList from '@/components/Inclusion/Peis/List/PeiList';
import { usePeiList } from '@/components/Inclusion/Peis/List/usePeiList';
import PeiDeleteModal from '@/components/Inclusion/Peis/PeiDeleteModal';
import { peiAllBreadcrumb, peiUrls } from '@/components/Inclusion/Peis/Peis.routes';
import type { PeiListProps } from '@/components/Inclusion/Peis/Peis.types';
import { TableListLayout } from '@/components/Tables/TableList/TableList';
import { peiAllTour } from '@/components/Inclusion/Peis/peiTours';

export default function InclusionPeisAllPage({
    peis,
    semesters,
    students = [],
    filters: initialFilters,
    can,
}: PeiListProps): React.JSX.Element {
    const { errors, filters, removal } = usePeiList({ url: peiUrls.all, initialFilters });

    return (
        <TableListLayout
            title="Listagem Geral de PEIs"
            subtitle="Visualização consolidada de todos os planos e adaptações curriculares do campus."
            breadcrumbItems={peiAllBreadcrumb()}
            tour={peiAllTour}
            listLabel="Listagem de PEIs"
            loading={filters.loading}
            loadingLabel="Atualizando PEIs"
            filters={
                <PeiFilters
                    variant="all"
                    values={filters.values}
                    semesters={semesters}
                    students={students}
                    errors={errors}
                    onUpdate={filters.update}
                    onClear={filters.clear}
                    onSubmit={filters.submit}
                />
            }
            dialogs={
                <PeiDeleteModal
                    pei={removal.target}
                    processing={removal.processing}
                    onClose={removal.close}
                    onConfirm={removal.confirm}
                />
            }
        >
            <PeiList
                variant="all"
                peis={peis}
                permissions={can}
                loading={filters.loading}
                processing={removal.processing}
                onDelete={removal.open}
                onPageSelect={filters.selectPage}
            />
        </TableListLayout>
    );
}
