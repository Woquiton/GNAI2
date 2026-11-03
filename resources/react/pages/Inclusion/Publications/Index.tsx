import { usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import PublicationFilters from '@/components/Inclusion/Publications/List/PublicationFilters';
import PublicationList from '@/components/Inclusion/Publications/List/PublicationList';
import PublicationDeleteModal from '@/components/Inclusion/Publications/PublicationDeleteModal';
import { emptyPublicationFilters } from '@/components/Inclusion/Publications/Publications.constants';
import {
    publicationBreadcrumb,
    publicationUrls,
} from '@/components/Inclusion/Publications/Publications.routes';
import { publicationListTour } from '@/components/Inclusion/Publications/publicationTours';
import type {
    PublicationIndexProps,
    PublicationRecord,
} from '@/components/Inclusion/Publications/Publications.types';
import { TableListLayout, useTableListFilters } from '@/components/Tables/TableList/TableList';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';
export default function InclusionPublicationsIndexPage({
    publications,
    filters: initialFilters,
    types,
    can,
}: PublicationIndexProps): React.JSX.Element {
    const errors = usePage().props.errors as Record<string, string | undefined>;
    const initialValues = useMemo(
        () => ({
            ...emptyPublicationFilters,
            ...initialFilters,
            is_active: String(initialFilters.is_active ?? ''),
            type: String(initialFilters.type ?? ''),
        }),
        [initialFilters],
    );
    const filters = useTableListFilters({
        url: publicationUrls.index,
        initialFilters: initialValues,
        emptyFilters: emptyPublicationFilters,
        failureText: 'Não foi possível atualizar as publicações. Tente novamente.',
    });
    const removal = useConfirmedAction<PublicationRecord>({
        failureText: 'Não foi possível excluir a publicação. Tente novamente.',
    });
    function remove(): void {
        if (can.destroy && removal.target) {
            filters.cancelScheduled();
            removal.submit('delete', publicationUrls.destroy(removal.target.id));
        }
    }
    return (
        <TableListLayout
            title="Publicações"
            subtitle="Notícias, eventos, comunicados e registros exibidos no site."
            breadcrumbItems={publicationBreadcrumb()}
            create={can.create && { href: publicationUrls.create, label: 'Cadastrar publicação' }}
            listLabel="Listagem de publicações"
            tour={publicationListTour}
            loading={filters.loading}
            loadingLabel="Atualizando as publicações"
            filters={
                <PublicationFilters
                    values={filters.values}
                    types={types}
                    errors={errors}
                    onUpdate={filters.update}
                    onClear={filters.clear}
                    onSubmit={filters.submit}
                />
            }
            dialogs={
                <PublicationDeleteModal
                    publication={removal.target}
                    processing={removal.processing}
                    onClose={removal.close}
                    onConfirm={remove}
                />
            }
        >
            <PublicationList
                publications={publications}
                permissions={can}
                loading={filters.loading}
                processing={removal.processing}
                onDelete={(publication) => {
                    filters.cancelScheduled();
                    removal.open(publication);
                }}
                onPageSelect={filters.selectPage}
            />
        </TableListLayout>
    );
}
