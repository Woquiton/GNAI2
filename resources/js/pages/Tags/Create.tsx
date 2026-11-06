import TagForm from '@/components/Tags/Form/TagForm';
import { tagBreadcrumb } from '@/components/Tags/Tags.routes';
import type { TagCreateProps } from '@/components/Tags/Tags.types';
import { tagCreateTour } from '@/components/Tags/tagTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function TagsCreatePage({
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
