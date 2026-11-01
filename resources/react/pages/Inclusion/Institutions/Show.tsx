import InstitutionDetails from '@/components/Inclusion/Institutions/Details/InstitutionDetails';
import InstitutionDetailsActions from '@/components/Inclusion/Institutions/Details/InstitutionDetailsActions';
import InstitutionDeleteModal from '@/components/Inclusion/Institutions/InstitutionDeleteModal';
import {
    institutionBreadcrumb,
    institutionUrls,
} from '@/components/Inclusion/Institutions/Institutions.routes';
import type {
    InstitutionRecord,
    InstitutionShowProps,
} from '@/components/Inclusion/Institutions/Institutions.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function InclusionInstitutionsShowPage({
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
