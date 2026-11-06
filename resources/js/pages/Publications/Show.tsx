import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import PublicationDetails from '@/components/Publications/Details/PublicationDetails';
import PublicationDetailsActions from '@/components/Publications/Details/PublicationDetailsActions';
import PublicationDeleteModal from '@/components/Publications/PublicationDeleteModal';
import {
    publicationBreadcrumb,
    publicationUrls,
} from '@/components/Publications/Publications.routes';
import { publicationShowTour } from '@/components/Publications/publicationTours';
import type {
    PublicationShowProps,
    PublicationRecord,
} from '@/components/Publications/Publications.types';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';
export default function PublicationsShowPage({
    publication,
    backRoute,
    can,
}: PublicationShowProps): React.JSX.Element {
    const removal = useConfirmedAction<PublicationRecord>({
        failureText: 'Não foi possível excluir a publicação. Tente novamente.',
    });
    function remove(): void {
        if (can.destroy && removal.target)
            removal.submit('delete', publicationUrls.destroy(removal.target.id));
    }
    return (
        <BusinessPage
            title="Detalhes da publicação"
            subtitle="Visualize o conteúdo, as mídias e a situação da publicação no site."
            busy={removal.processing}
            tour={publicationShowTour}
            breadcrumbItems={publicationBreadcrumb({
                publicationId: publication.id,
                publicationTitle: publication.title,
                backRoute,
            })}
        >
            <PublicationDetails publication={publication} />
            <PublicationDetailsActions
                publication={publication}
                backRoute={backRoute}
                can={can}
                processing={removal.processing}
                onDelete={() => removal.open(publication)}
            />
            <PublicationDeleteModal
                publication={removal.target}
                processing={removal.processing}
                onClose={removal.close}
                onConfirm={remove}
            />
        </BusinessPage>
    );
}
