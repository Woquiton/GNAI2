import TagDetails from '@/components/Tags/Details/TagDetails';
import TagDetailsActions from '@/components/Tags/Details/TagDetailsActions';
import TagDeleteModal from '@/components/Tags/TagDeleteModal';
import { tagBreadcrumb, tagUrls } from '@/components/Tags/Tags.routes';
import type { TagShowProps } from '@/components/Tags/Tags.types';
import { tagShowTour } from '@/components/Tags/tagTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function TagsShowPage({ tag, can }: TagShowProps): React.JSX.Element {
    const removal = useConfirmedAction<typeof tag>({
        failureText: 'Não foi possível excluir a etiqueta. Tente novamente.',
    });

    return (
        <BusinessPage
            title="Detalhes da Etiqueta"
            subtitle={`Visualize as informações cadastrais e status da etiqueta: ${tag.name}`}
            documentTitle={tag.name}
            breadcrumbItems={tagBreadcrumb({ tag })}
            tour={tagShowTour}
            busy={removal.processing}
        >
            <TagDetails tag={tag} />
            <TagDetailsActions
                tagId={tag.id}
                permissions={can}
                deleting={removal.processing}
                onDelete={() => removal.open(tag)}
            />
            <TagDeleteModal
                tag={removal.target}
                processing={removal.processing}
                onClose={removal.close}
                onConfirm={() => removal.submit('delete', tagUrls.destroy(tag.id))}
            />
        </BusinessPage>
    );
}
