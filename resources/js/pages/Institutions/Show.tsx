import InstitutionDetails from '@/components/Institutions/Details/InstitutionDetails';
import InstitutionDetailsActions from '@/components/Institutions/Details/InstitutionDetailsActions';
import InstitutionDeleteModal from '@/components/Institutions/InstitutionDeleteModal';
import { institutionShowTour } from '@/components/Institutions/institutionTours';
import {
    institutionBreadcrumb,
    institutionUrls,
} from '@/components/Institutions/Institutions.routes';
import type {
    InstitutionRecord,
    InstitutionShowProps,
} from '@/components/Institutions/Institutions.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function InstitutionsShowPage({
    institution,
    can,
}: InstitutionShowProps): React.JSX.Element {
    const removal = useConfirmedAction<InstitutionRecord>({
        failureText: 'Não foi possível excluir a instituição. Tente novamente.',
    });

    return (
        <BusinessPage
            title="Detalhes da Instituição"
            subtitle={`Visualize as informações cadastrais e a localização no mapa da instituição: ${institution.name}`}
            documentTitle={institution.name}
            breadcrumbItems={institutionBreadcrumb({ institution })}
            tour={institutionShowTour}
            busy={removal.processing}
        >
            <InstitutionDetails institution={institution} />
            <InstitutionDetailsActions
                institutionId={institution.id}
                permissions={can}
                deleting={removal.processing}
                onDelete={() => removal.open(institution)}
            />
            <InstitutionDeleteModal
                institution={removal.target}
                processing={removal.processing}
                onClose={removal.close}
                onConfirm={() => removal.submit('delete', institutionUrls.destroy(institution.id))}
            />
        </BusinessPage>
    );
}
