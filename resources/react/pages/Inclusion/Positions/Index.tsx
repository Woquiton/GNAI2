import { usePage } from '@inertiajs/react';
import PositionFilters from '@/components/Inclusion/Positions/List/PositionFilters';
import PositionList from '@/components/Inclusion/Positions/List/PositionList';
import PositionDeleteModal from '@/components/Inclusion/Positions/PositionDeleteModal';
import { emptyPositionFilters } from '@/components/Inclusion/Positions/Positions.constants';
import {
    positionBreadcrumb,
    positionUrls,
} from '@/components/Inclusion/Positions/Positions.routes';
import type {
    PositionIndexProps,
    PositionSummary,
} from '@/components/Inclusion/Positions/Positions.types';
import { positionListTour } from '@/components/Inclusion/Positions/positionTours';
import { TableListLayout, useTableListFilters } from '@/components/Tables/TableList/TableList';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function InclusionPositionsIndexPage({
    positions,
    filters: initialFilters,
    can,
}: PositionIndexProps): React.JSX.Element {
    const errors = usePage().props.errors as Record<string, string | undefined>;
    const filters = useTableListFilters({
        url: positionUrls.index,
        initialFilters,
        emptyFilters: emptyPositionFilters,
        failureText: 'Não foi possível atualizar os cargos. Tente novamente.',
    });
    const removal = useConfirmedAction<PositionSummary>({
        failureText: 'Não foi possível excluir o cargo. Tente novamente.',
    });

    function openRemoval(position: PositionSummary): void {
        filters.cancelScheduled();
        removal.open(position);
    }

    function confirmRemoval(): void {
        if (removal.target) {
            removal.submit('delete', positionUrls.destroy(removal.target.id));
        }
    }

    return (
        <TableListLayout
            title="Lista de Cargos"
            subtitle="Gerenciamento de funções para o suporte especializado."
            breadcrumbItems={positionBreadcrumb()}
            tour={positionListTour}
            create={can.create && { href: positionUrls.create, label: 'Cadastrar cargo' }}
            listLabel="Listagem de cargos"
            loading={filters.loading}
            loadingLabel="Atualizando cargos"
            filters={
                <PositionFilters
                    values={filters.values}
                    errors={errors}
                    onUpdate={filters.update}
                    onClear={filters.clear}
                    onSubmit={filters.submit}
                />
            }
            dialogs={
                <PositionDeleteModal
                    position={removal.target}
                    processing={removal.processing}
                    onClose={removal.close}
                    onConfirm={confirmRemoval}
                />
            }
        >
            <PositionList
                positions={positions}
                permissions={can}
                loading={filters.loading}
                deleting={removal.processing}
                onDelete={openRemoval}
                onPageSelect={filters.selectPage}
            />
        </TableListLayout>
    );
}
