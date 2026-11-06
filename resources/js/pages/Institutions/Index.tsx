import { usePage } from '@inertiajs/react';
import InstitutionDeleteModal from '@/components/Institutions/InstitutionDeleteModal';
import { institutionListTour } from '@/components/Institutions/institutionTours';
import { emptyInstitutionFilters } from '@/components/Institutions/Institutions.constants';
import {
    institutionBreadcrumb,
    institutionUrls,
} from '@/components/Institutions/Institutions.routes';
import type {
    InstitutionIndexProps,
    InstitutionRecord,
} from '@/components/Institutions/Institutions.types';
import InstitutionFilters from '@/components/Institutions/List/InstitutionFilters';
import InstitutionList from '@/components/Institutions/List/InstitutionList';
import { TableListLayout, useTableListFilters } from '@/components/Tables/TableList/TableList';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function InstitutionsIndexPage({
    institutions,
    filters: initialFilters,
    can,
}: InstitutionIndexProps): React.JSX.Element {
    const errors = usePage().props.errors as Record<string, string | undefined>;
    const filters = useTableListFilters({
        url: institutionUrls.index,
        initialFilters,
        emptyFilters: emptyInstitutionFilters,
        failureText: 'Não foi possível atualizar as instituições. Tente novamente.',
    });
    const removal = useConfirmedAction<InstitutionRecord>({
        failureText: 'Não foi possível excluir a instituição. Tente novamente.',
    });

    function requestRemoval(institution: InstitutionRecord): void {
        filters.cancelScheduled();
        removal.open(institution);
    }

    function confirmRemoval(): void {
        if (removal.target) {
            removal.submit('delete', institutionUrls.destroy(removal.target.id));
        }
    }

    return (
        <TableListLayout
            title="Instituições Base"
            subtitle="Gerencie os locais centrais onde o radar de acessibilidade opera."
            breadcrumbItems={institutionBreadcrumb()}
            create={can.create && { href: institutionUrls.create, label: 'Cadastrar instituição' }}
            tour={institutionListTour}
            listLabel="Listagem de instituições"
            loading={filters.loading}
            loadingLabel="Atualizando instituições"
            filters={
                <InstitutionFilters
                    values={filters.values}
                    errors={errors}
                    onUpdate={filters.update}
                    onClear={filters.clear}
                    onSubmit={filters.submit}
                />
            }
            dialogs={
                <InstitutionDeleteModal
                    institution={removal.target}
                    processing={removal.processing}
                    onClose={removal.close}
                    onConfirm={confirmRemoval}
                />
            }
        >
            <InstitutionList
                institutions={institutions}
                permissions={can}
                loading={filters.loading}
                processing={removal.processing}
                onDelete={requestRemoval}
                onPageSelect={filters.selectPage}
            />
        </TableListLayout>
    );
}
