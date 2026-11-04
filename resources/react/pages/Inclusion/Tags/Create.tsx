import TagForm from '@/components/Inclusion/Tags/Form/TagForm';
import { tagBreadcrumb } from '@/components/Inclusion/Tags/Tags.routes';
import type { TagCreateProps } from '@/components/Inclusion/Tags/Tags.types';
import { tagCreateTour } from '@/components/Inclusion/Tags/tagTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionTagsCreatePage({
    can,
    modules,
}: TagCreateProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Nova Etiqueta"
            subtitle="Defina nome, módulo, cor e situação da etiqueta."
            breadcrumbItems={tagBreadcrumb({ current: 'Cadastrar' })}
            tour={tagCreateTour}
        >
            <TagForm canSubmit={can.store} modules={modules} />
        </BusinessPage>
    );
}
