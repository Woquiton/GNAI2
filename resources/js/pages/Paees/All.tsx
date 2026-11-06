import PaeeDeleteModal from '@/components/Paees/PaeeDeleteModal';
import PaeeFilters from '@/components/Paees/List/PaeeFilters';
import PaeeList from '@/components/Paees/List/PaeeList';
import { usePaeeList } from '@/components/Paees/List/usePaeeList';
import { paeeAllBreadcrumb, paeeUrls } from '@/components/Paees/Paees.routes';
import { paeeListTour } from '@/components/Paees/paeeTours';
import type { PaeeListProps } from '@/components/Paees/Paees.types';
import { TableListLayout } from '@/components/Tables/TableList/TableList';

export default function PaeesAllPage({
    paees,
    semesters,
    filters: initialFilters,
    can,
}: PaeeListProps): React.JSX.Element {
    const { errors, filters, removal } = usePaeeList({ url: paeeUrls.all, initialFilters });

    return (
        <TableListLayout
            title="PAEE"
            subtitle="Plano de Atendimento Educacional Especializado, vinculado a um Estudo de Caso concluído."
            breadcrumbItems={paeeAllBreadcrumb()}
            tour={paeeListTour}
            listLabel="Listagem geral de PAEEs"
            loading={filters.loading}
            loadingLabel="Atualizando PAEEs"
            filters={
                <PaeeFilters
                    values={filters.values}
                    semesters={semesters}
                    showSearch
                    errors={errors}
                    onUpdate={filters.update}
                    onClear={filters.clear}
                    onSubmit={filters.submit}
                />
            }
            dialogs={
                <PaeeDeleteModal
                    name={removal.name}
                    processing={removal.processing}
                    onClose={removal.close}
                    onConfirm={removal.confirm}
                />
            }
        >
            <PaeeList
                paees={paees}
                permissions={can}
                loading={filters.loading}
                processing={removal.processing}
                onDelete={removal.open}
                onPageSelect={filters.selectPage}
            />
        </TableListLayout>
    );
}
