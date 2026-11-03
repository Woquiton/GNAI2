import { usePage } from '@inertiajs/react';
import ProfessionalFilters from '@/components/Inclusion/Professionals/List/ProfessionalFilters';
import ProfessionalList from '@/components/Inclusion/Professionals/List/ProfessionalList';
import { professionalListTour } from '@/components/Inclusion/Professionals/professionalTours';
import ProfessionalDeleteModal from '@/components/Inclusion/Professionals/ProfessionalDeleteModal';
import { emptyProfessionalFilters } from '@/components/Inclusion/Professionals/Professionals.constants';
import {
    professionalBreadcrumb,
    professionalUrls,
} from '@/components/Inclusion/Professionals/Professionals.routes';
import type {
    ProfessionalIndexProps,
    ProfessionalListRecord,
} from '@/components/Inclusion/Professionals/Professionals.types';
import { TableListLayout, useTableListFilters } from '@/components/Tables/TableList/TableList';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function InclusionProfessionalsIndexPage({
    professionals,
    positions,
    professionalStatuses,
    professionalStatusColors,
    filters: initialFilters,
    can,
}: ProfessionalIndexProps): React.JSX.Element {
    const errors = usePage().props.errors as Record<string, string | undefined>;
    const filters = useTableListFilters({
        url: professionalUrls.index,
        initialFilters,
        emptyFilters: emptyProfessionalFilters,
        failureText: 'Não foi possível atualizar a listagem de profissionais. Tente novamente.',
    });
    const removal = useConfirmedAction<ProfessionalListRecord>({
        failureText: 'Não foi possível excluir o profissional. Tente novamente.',
    });

    function confirmRemoval(): void {
        if (removal.target) {
            filters.cancelScheduled();
            removal.submit('delete', professionalUrls.destroy(removal.target.id));
        }
    }

    return (
        <TableListLayout
            title="Profissionais"
            subtitle="Cadastre profissionais ou tutores de pares no sistema. Embora esta seção seja denominada “Profissionais”, também é possível cadastrar e gerenciar tutores de pares, utilizando a mesma estrutura de dados e funcionalidades disponíveis."
            breadcrumbItems={professionalBreadcrumb()}
            tour={professionalListTour}
            create={
                can.create && { href: professionalUrls.create, label: 'Cadastrar profissional' }
            }
            listLabel="Listagem de profissionais"
            loading={filters.loading}
            loadingLabel="Atualizando profissionais"
            filters={
                <ProfessionalFilters
                    values={filters.values}
                    positions={positions}
                    professionalStatuses={professionalStatuses}
                    errors={errors}
                    onUpdate={filters.update}
                    onClear={filters.clear}
                    onSubmit={filters.submit}
                />
            }
            dialogs={
                <ProfessionalDeleteModal
                    target={removal.target ? { name: removal.target.person.name } : null}
                    context="list"
                    processing={removal.processing}
                    onClose={removal.close}
                    onConfirm={confirmRemoval}
                />
            }
        >
            <ProfessionalList
                professionals={professionals}
                professionalStatuses={professionalStatuses}
                professionalStatusColors={professionalStatusColors}
                permissions={can}
                loading={filters.loading}
                processing={removal.processing}
                onDelete={(professional) => {
                    filters.cancelScheduled();
                    removal.open(professional);
                }}
                onPageSelect={filters.selectPage}
            />
        </TableListLayout>
    );
}
