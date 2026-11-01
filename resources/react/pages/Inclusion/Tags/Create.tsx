import TagForm from '@/components/Inclusion/Tags/Form/TagForm';
import { tagBreadcrumb } from '@/components/Inclusion/Tags/Tags.routes';
import type { TagCreateProps } from '@/components/Inclusion/Tags/Tags.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionTagsCreatePage({ can }: TagCreateProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Nova Etiqueta"
            subtitle="Defina uma nova etiqueta para classificar as publicações."
            breadcrumbItems={tagBreadcrumb({ current: 'Cadastrar' })}
        >
            <TagForm canSubmit={can.store} />
        </BusinessPage>
    );
}
