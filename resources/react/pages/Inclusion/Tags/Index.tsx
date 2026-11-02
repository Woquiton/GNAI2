import { usePage } from '@inertiajs/react';
import TagFilters from '@/components/Inclusion/Tags/List/TagFilters';
import TagList from '@/components/Inclusion/Tags/List/TagList';
import TagDeleteModal from '@/components/Inclusion/Tags/TagDeleteModal';
import { emptyTagFilters } from '@/components/Inclusion/Tags/Tags.constants';
import { tagBreadcrumb, tagUrls } from '@/components/Inclusion/Tags/Tags.routes';
import type { TagIndexProps, TagRecord } from '@/components/Inclusion/Tags/Tags.types';
import { TableListLayout, useTableListFilters } from '@/components/Tables/TableList/TableList';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function InclusionTagsIndexPage({
    tags,
    filters: initialFilters,
    can,
}: TagIndexProps): React.JSX.Element {
    const errors = usePage().props.errors as Record<string, string | undefined>;
    const filters = useTableListFilters({
        url: tagUrls.index,
        initialFilters,
        emptyFilters: emptyTagFilters,
        failureText: 'Não foi possível atualizar as etiquetas. Tente novamente.',
    });
    const removal = useConfirmedAction<TagRecord>({
        failureText: 'Não foi possível excluir a etiqueta. Tente novamente.',
    });

    function confirmRemoval(): void {
        if (removal.target) {
            filters.cancelScheduled();
            removal.submit('delete', tagUrls.destroy(removal.target.id));
        }
    }

    return (
        <TableListLayout
            title="Etiquetas"
            subtitle="Gerencie as etiquetas disponíveis para classificar as publicações."
            breadcrumbItems={tagBreadcrumb()}
            create={can.create && { href: tagUrls.create, label: 'Cadastrar etiqueta' }}
            listLabel="Listagem de etiquetas"
            loading={filters.loading}
            loadingLabel="Atualizando etiquetas"
            filters={
                <TagFilters
                    values={filters.values}
                    errors={errors}
                    onUpdate={filters.update}
                    onClear={filters.clear}
                    onSubmit={filters.submit}
                />
            }
            dialogs={
                <TagDeleteModal
                    tag={removal.target}
                    processing={removal.processing}
                    onClose={removal.close}
                    onConfirm={confirmRemoval}
                />
            }
        >
            <TagList
                tags={tags}
                permissions={can}
                loading={filters.loading}
                processing={removal.processing}
                onDelete={removal.open}
                onPageSelect={filters.selectPage}
            />
        </TableListLayout>
    );
}
