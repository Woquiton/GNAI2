import { usePage } from '@inertiajs/react';
import DisciplineDeleteModal from '@/components/Disciplines/DisciplineDeleteModal';
import { emptyDisciplineFilters } from '@/components/Disciplines/Disciplines.constants';
import {
    disciplineBreadcrumb,
    disciplineUrls,
} from '@/components/Disciplines/Disciplines.routes';
import type {
    DisciplineIndexProps,
    DisciplineRecord,
} from '@/components/Disciplines/Disciplines.types';
import DisciplineFilters from '@/components/Disciplines/List/DisciplineFilters';
import DisciplineList from '@/components/Disciplines/List/DisciplineList';
import { disciplineListTour } from '@/components/Disciplines/disciplineTours';
import { TableListLayout, useTableListFilters } from '@/components/Tables/TableList/TableList';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function DisciplinesIndexPage({
    disciplines,
    filters: initialFilters,
    can,
}: DisciplineIndexProps): React.JSX.Element {
    const errors = usePage().props.errors as Record<string, string | undefined>;
    const filters = useTableListFilters({
        url: disciplineUrls.index,
        initialFilters,
        emptyFilters: emptyDisciplineFilters,
        failureText: 'Não foi possível atualizar as disciplinas. Tente novamente.',
    });
    const removal = useConfirmedAction<DisciplineRecord>({
        failureText: 'Não foi possível excluir a disciplina. Tente novamente.',
    });

    function openRemoval(discipline: DisciplineRecord): void {
        filters.cancelScheduled();
        removal.open(discipline);
    }

    function confirmRemoval(): void {
        if (removal.target) {
            removal.submit('delete', disciplineUrls.destroy(removal.target.id));
        }
    }

    return (
        <TableListLayout
            title="Disciplinas"
            subtitle="Gerencie as disciplinas cadastradas no sistema."
            breadcrumbItems={disciplineBreadcrumb()}
            create={can.create && { href: disciplineUrls.create, label: 'Cadastrar disciplina' }}
            listLabel="Listagem de disciplinas"
            loading={filters.loading}
            loadingLabel="Atualizando disciplinas"
            tour={disciplineListTour}
            filters={
                <DisciplineFilters
                    values={filters.values}
                    errors={errors}
                    onUpdate={filters.update}
                    onClear={filters.clear}
                    onSubmit={filters.submit}
                />
            }
            dialogs={
                <DisciplineDeleteModal
                    discipline={removal.target}
                    processing={removal.processing}
                    onClose={removal.close}
                    onConfirm={confirmRemoval}
                />
            }
        >
            <DisciplineList
                disciplines={disciplines}
                permissions={can}
                loading={filters.loading}
                processing={removal.processing}
                onDelete={openRemoval}
                onPageSelect={filters.selectPage}
            />
        </TableListLayout>
    );
}
