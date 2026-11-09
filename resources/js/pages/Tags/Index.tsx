import { usePage } from '@inertiajs/react';
import TagFilters from '@/components/Tags/List/TagFilters';
import TagList from '@/components/Tags/List/TagList';
import TagDeleteModal from '@/components/Tags/TagDeleteModal';
import { emptyTagFilters } from '@/components/Tags/Tags.constants';
import { tagBreadcrumb, tagUrls } from '@/components/Tags/Tags.routes';
import type { TagIndexProps, TagRecord } from '@/components/Tags/Tags.types';
import { tagListTour } from '@/components/Tags/tagTours';
import { TableListLayout, useTableListFilters } from '@/components/Tables/TableList/TableList';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function TagsIndexPage({
    tags,
    filters: initialFilters,
    can,
    modules,
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
            subtitle="Gerencie etiquetas de pessoas, publicações e marcadores da Inbox."
            breadcrumbItems={tagBreadcrumb()}
            tour={tagListTour}
            create={can.create && { href: tagUrls.create, label: 'Cadastrar etiqueta' }}
            listLabel="Listagem de etiquetas"
            loading={filters.loading}
            loadingLabel="Atualizando etiquetas"
            filters={
                <TagFilters
                    values={filters.values}
                    modules={modules}
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
