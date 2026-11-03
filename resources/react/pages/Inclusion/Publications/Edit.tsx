import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import PublicationForm from '@/components/Inclusion/Publications/Form/PublicationForm';
import { publicationBreadcrumb } from '@/components/Inclusion/Publications/Publications.routes';
import { publicationEditTour } from '@/components/Inclusion/Publications/publicationTours';
import type { PublicationEditProps } from '@/components/Inclusion/Publications/Publications.types';
export default function InclusionPublicationsEditPage({
    publication,
    options,
    can,
}: PublicationEditProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Editar publicação"
            tour={publicationEditTour}
            subtitle="Escreva o conteúdo, anexe as mídias e defina como a publicação vai ao ar no site."
            breadcrumbItems={publicationBreadcrumb({
                current: 'Editar',
                publicationId: publication.id,
                publicationTitle: publication.title,
            })}
        >
            <PublicationForm
                key={publication.id}
                publication={publication}
                options={options}
                canSubmit={can.submit}
            />
        </BusinessPage>
    );
}
