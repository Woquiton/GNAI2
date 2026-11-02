import { usePage } from '@inertiajs/react';
import PendencyFilters from '@/components/Inclusion/Pendencies/List/PendencyFilters';
import PendencyList from '@/components/Inclusion/Pendencies/List/PendencyList';
import PendencyDeleteModal from '@/components/Inclusion/Pendencies/PendencyDeleteModal';
import { emptyPendencyFilters } from '@/components/Inclusion/Pendencies/Pendencies.constants';
import {
    pendencyBreadcrumb,
    pendencyUrls,
} from '@/components/Inclusion/Pendencies/Pendencies.routes';
import type {
    PendencyListProps,
    PendencyListRecord,
} from '@/components/Inclusion/Pendencies/Pendencies.types';
import { TableListLayout, useTableListFilters } from '@/components/Tables/TableList/TableList';
import Button from '@/components/UI/Button/Button';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function InclusionPendenciesIndexPage({
    pendencies,
    priorities,
    professionals = [],
    filters: initialFilters,
    can,
}: PendencyListProps): React.JSX.Element {
    const errors = usePage().props.errors as Record<string, string | undefined>;
    const filters = useTableListFilters({
        url: pendencyUrls.index,
        initialFilters,
        emptyFilters: emptyPendencyFilters,
        failureText: 'Não foi possível atualizar as pendências. Tente novamente.',
    });
    const removal = useConfirmedAction<PendencyListRecord>({
        failureText: 'Não foi possível excluir a pendência. Tente novamente.',
    });
    const canDelete = Boolean(can.delete);
    const myPendencies = can.my ? (
        <Button
            href={pendencyUrls.my}
            tone="info"
            leftIconClass="fa fa-user"
            label="Minhas Pendências"
        />
    ) : undefined;

    function confirmRemoval(): void {
        if (removal.target) {
            filters.cancelScheduled();
            removal.submit('delete', pendencyUrls.destroy(removal.target.id));
        }
    }

    return (
        <TableListLayout
            title="Pendências"
            subtitle="Gerencie as pendências e seus responsáveis."
            breadcrumbItems={pendencyBreadcrumb()}
            actions={myPendencies}
            create={can.create && { href: pendencyUrls.create, label: 'Cadastrar pendência' }}
            listLabel="Listagem de pendências"
            loading={filters.loading}
            loadingLabel="Atualizando pendências"
            filters={
                <PendencyFilters
                    values={filters.values}
                    priorities={priorities}
                    professionals={professionals}
                    errors={errors}
                    onUpdate={filters.update}
                    onClear={filters.clear}
                    onSubmit={filters.submit}
                />
            }
            dialogs={
                canDelete ? (
                    <PendencyDeleteModal
                        pendency={removal.target}
                        processing={removal.processing}
                        onClose={removal.close}
                        onConfirm={confirmRemoval}
                    />
                ) : undefined
            }
        >
            <PendencyList
                variant="all"
                pendencies={pendencies}
                priorities={priorities}
                permissions={{ view: can.view, delete: canDelete }}
                loading={filters.loading}
                processing={removal.processing}
                onDelete={removal.open}
                onPageSelect={filters.selectPage}
            />
        </TableListLayout>
    );
}
