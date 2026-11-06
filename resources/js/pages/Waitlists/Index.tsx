import { usePage } from '@inertiajs/react';
import WaitlistFilters from '@/components/Waitlists/List/WaitlistFilters';
import WaitlistList from '@/components/Waitlists/List/WaitlistList';
import WaitlistDeleteModal from '@/components/Waitlists/WaitlistDeleteModal';
import { emptyWaitlistFilters } from '@/components/Waitlists/Waitlists.constants';
import {
    waitlistBreadcrumb,
    waitlistUrls,
} from '@/components/Waitlists/Waitlists.routes';
import type {
    WaitlistIndexProps,
    WaitlistRecord,
} from '@/components/Waitlists/Waitlists.types';
import { waitlistListTour } from '@/components/Waitlists/waitlistTours';
import { TableListLayout, useTableListFilters } from '@/components/Tables/TableList/TableList';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function WaitlistsIndexPage({
    waitlists,
    filters: initialFilters,
    semesters,
    can,
}: WaitlistIndexProps): React.JSX.Element {
    const errors = usePage().props.errors as Record<string, string | undefined>;
    const filters = useTableListFilters({
        url: waitlistUrls.index,
        initialFilters,
        emptyFilters: emptyWaitlistFilters,
        failureText: 'Não foi possível atualizar a fila de espera. Tente novamente.',
    });
    const removal = useConfirmedAction<WaitlistRecord>({
        failureText: 'Não foi possível excluir a solicitação. Tente novamente.',
    });

    function confirmRemoval(): void {
        if (removal.target) {
            filters.cancelScheduled();
            removal.submit('delete', waitlistUrls.destroy(removal.target.id));
        }
    }

    return (
        <TableListLayout
            title="Fila de Espera"
            subtitle="Gerencie solicitações de recursos que estão indisponíveis para empréstimo."
            breadcrumbItems={waitlistBreadcrumb()}
            tour={waitlistListTour}
            create={
                can.create && {
                    href: waitlistUrls.create,
                    label: 'Cadastrar solicitação na fila de espera',
                }
            }
            listLabel="Listagem da fila de espera"
            loading={filters.loading}
            loadingLabel="Atualizando a fila de espera"
            filters={
                <WaitlistFilters
                    semesters={semesters}
                    values={filters.values}
                    errors={errors}
                    onUpdate={filters.update}
                    onClear={filters.clear}
                    onSubmit={filters.submit}
                />
            }
            dialogs={
                <WaitlistDeleteModal
                    waitlist={removal.target}
                    processing={removal.processing}
                    onClose={removal.close}
                    onConfirm={confirmRemoval}
                />
            }
        >
            <WaitlistList
                waitlists={waitlists}
                permissions={can}
                loading={filters.loading}
                processing={removal.processing}
                onDelete={removal.open}
                onPageSelect={filters.selectPage}
            />
        </TableListLayout>
    );
}
