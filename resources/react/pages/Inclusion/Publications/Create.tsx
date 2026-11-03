import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import PublicationForm from '@/components/Inclusion/Publications/Form/PublicationForm';
import { publicationBreadcrumb } from '@/components/Inclusion/Publications/Publications.routes';
import { publicationCreateTour } from '@/components/Inclusion/Publications/publicationTours';
import type { PublicationCreateProps } from '@/components/Inclusion/Publications/Publications.types';
export default function InclusionPublicationsCreatePage({
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
