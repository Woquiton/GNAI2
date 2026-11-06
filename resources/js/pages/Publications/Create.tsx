import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import PublicationForm from '@/components/Publications/Form/PublicationForm';
import { publicationBreadcrumb } from '@/components/Publications/Publications.routes';
import { publicationCreateTour } from '@/components/Publications/publicationTours';
import type { PublicationCreateProps } from '@/components/Publications/Publications.types';
export default function PublicationsCreatePage({
    backRoute,
    options,
    can,
}: PublicationCreateProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Nova publicação"
            subtitle="Escreva o conteúdo, anexe as mídias e defina como a publicação vai ao ar no site."
            breadcrumbItems={publicationBreadcrumb({ current: 'Cadastrar', backRoute })}
            tour={publicationCreateTour}
        >
            <PublicationForm backRoute={backRoute} options={options} canSubmit={can.submit} />
        </BusinessPage>
    );
}
