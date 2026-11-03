import TagForm from '@/components/Inclusion/Tags/Form/TagForm';
import { tagBreadcrumb } from '@/components/Inclusion/Tags/Tags.routes';
import type { TagEditProps } from '@/components/Inclusion/Tags/Tags.types';
import { tagEditTour } from '@/components/Inclusion/Tags/tagTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionTagsEditPage({ tag, can }: TagEditProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Editar Etiqueta"
            subtitle={`Atualizando informações de: ${tag.name}`}
            breadcrumbItems={tagBreadcrumb({ tag, current: 'Editar' })}
            tour={tagEditTour}
        >
            <TagForm key={tag.id} tag={tag} canSubmit={can.update} />
        </BusinessPage>
    );
}
