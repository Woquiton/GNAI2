import { usePage } from '@inertiajs/react';
import SupportRequestFilters from '@/components/Inclusion/SupportRequests/List/SupportRequestFilters';
import SupportRequestDeleteModal from '@/components/Inclusion/SupportRequests/SupportRequestDeleteModal';
import SupportRequestList from '@/components/Inclusion/SupportRequests/List/SupportRequestList';
import { emptySupportRequestFilters } from '@/components/Inclusion/SupportRequests/SupportRequests.constants';
import {
    supportRequestBreadcrumb,
    supportRequestUrls,
} from '@/components/Inclusion/SupportRequests/SupportRequests.routes';
import type {
    SupportRequestIndexProps,
    SupportRequestSummary,
} from '@/components/Inclusion/SupportRequests/SupportRequests.types';
import { TableListLayout, useTableListFilters } from '@/components/Tables/TableList/TableList';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function SupportRequestsIndex({
    requests,
    filters: initialFilters,
    statuses,
    students,
    can,
}: SupportRequestIndexProps): React.JSX.Element {
    const errors = usePage().props.errors as Record<string, string | undefined>;
    const filters = useTableListFilters({
        url: supportRequestUrls.index,
        initialFilters,
        emptyFilters: emptySupportRequestFilters,
        failureText: 'Não foi possível atualizar as solicitações. Tente novamente.',
    });
    const removal = useConfirmedAction<SupportRequestSummary>({
        failureText: 'Não foi possível excluir a solicitação. Tente novamente.',
    });
    function confirmRemoval(): void {
        if (!removal.target) return;
        filters.cancelScheduled();
        removal.submit('delete', supportRequestUrls.destroy(removal.target.id));
    }
    const createUrl = filters.values.student_id
        ? supportRequestUrls.createForStudent(Number(filters.values.student_id))
        : supportRequestUrls.create;
    return (
        <TableListLayout
            title="Solicitações de Atendimento"
            subtitle="Acompanhe as demandas recebidas pelo núcleo e seus encaminhamentos."
            breadcrumbItems={supportRequestBreadcrumb()}
            create={can.create && { href: createUrl, label: 'Registrar solicitação' }}
            listLabel="Solicitações de atendimento"
            loading={filters.loading}
            loadingLabel="Atualizando solicitações"
            filters={
                <SupportRequestFilters
                    values={filters.values}
                    statuses={statuses}
                    students={students}
                    errors={errors}
                    onUpdate={filters.update}
                    onClear={filters.clear}
                    onSubmit={filters.submit}
                />
            }
            dialogs={
                <SupportRequestDeleteModal
                    target={removal.target}
                    processing={removal.processing}
                    onClose={removal.close}
                    onConfirm={confirmRemoval}
                />
            }
        >
            <SupportRequestList
                requests={requests}
                can={can}
                loading={filters.loading}
                processing={removal.processing}
                onDelete={removal.open}
                onPageSelect={filters.selectPage}
            />
        </TableListLayout>
    );
}
