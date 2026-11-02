import { usePage } from '@inertiajs/react';
import {
    deficiencyDescription,
    emptyDeficiencyFilters,
} from '@/components/Inclusion/Deficiencies/Deficiencies.constants';
import {
    deficiencyBreadcrumb,
    deficiencyUrls,
} from '@/components/Inclusion/Deficiencies/Deficiencies.routes';
import type {
    DeficiencyIndexProps,
    DeficiencyRecord,
} from '@/components/Inclusion/Deficiencies/Deficiencies.types';
import DeficiencyDeleteModal from '@/components/Inclusion/Deficiencies/DeficiencyDeleteModal';
import DeficiencyFilters from '@/components/Inclusion/Deficiencies/List/DeficiencyFilters';
import DeficiencyList from '@/components/Inclusion/Deficiencies/List/DeficiencyList';
import { TableListLayout, useTableListFilters } from '@/components/Tables/TableList/TableList';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function InclusionDeficienciesIndexPage({
    deficiencies,
    filters: initialFilters,
    can,
}: DeficiencyIndexProps): React.JSX.Element {
    const errors = usePage().props.errors as Record<string, string | undefined>;
    const filters = useTableListFilters({
        url: deficiencyUrls.index,
        initialFilters,
        emptyFilters: emptyDeficiencyFilters,
        failureText: 'Não foi possível atualizar os perfis de atendimento. Tente novamente.',
    });
    const removal = useConfirmedAction<DeficiencyRecord>({
        failureText: 'Não foi possível excluir o perfil de atendimento. Tente novamente.',
    });
    function confirmRemoval(): void {
        if (removal.target) {
            filters.cancelScheduled();
            removal.submit('delete', deficiencyUrls.destroy(removal.target.id));
        }
    }

    return (
        <TableListLayout
            title="Lista de Perfis de Atendimento"
            subtitle={deficiencyDescription}
            breadcrumbItems={deficiencyBreadcrumb()}
            create={
                can.create && {
                    href: deficiencyUrls.create,
                    label: 'Cadastrar perfil de atendimento',
                }
            }
            listLabel="Listagem de perfis de atendimento"
            loading={filters.loading}
            loadingLabel="Atualizando perfis de atendimento"
            filters={
                <DeficiencyFilters
                    values={filters.values}
                    errors={errors}
                    onUpdate={filters.update}
                    onClear={filters.clear}
                    onSubmit={filters.submit}
                />
            }
            dialogs={
                <DeficiencyDeleteModal
                    deficiency={removal.target}
                    context="list"
                    processing={removal.processing}
                    onClose={removal.close}
                    onConfirm={confirmRemoval}
                />
            }
        >
            <DeficiencyList
                deficiencies={deficiencies}
                permissions={can}
                loading={filters.loading}
                deleting={removal.processing}
                onDelete={removal.open}
                onPageSelect={filters.selectPage}
            />
        </TableListLayout>
    );
}
