import {
    deficiencyBreadcrumb,
    deficiencyUrls,
} from '@/components/Inclusion/Deficiencies/Deficiencies.routes';
import type { DeficiencyShowProps } from '@/components/Inclusion/Deficiencies/Deficiencies.types';
import DeficiencyDeleteModal from '@/components/Inclusion/Deficiencies/DeficiencyDeleteModal';
import DeficiencyDetails from '@/components/Inclusion/Deficiencies/Details/DeficiencyDetails';
import DeficiencyDetailsActions from '@/components/Inclusion/Deficiencies/Details/DeficiencyDetailsActions';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function InclusionDeficienciesShowPage({
    deficiency,
    can,
}: DeficiencyShowProps): React.JSX.Element {
    const removal = useConfirmedAction<typeof deficiency>({
        failureText: 'Não foi possível excluir o perfil de atendimento. Tente novamente.',
    });

    return (
        <BusinessPage
            title="Detalhes do Perfil"
            subtitle="Informações sobre o perfil para acompanhamento e encaminhamentos pedagógicos."
            documentTitle={deficiency.name}
            breadcrumbItems={deficiencyBreadcrumb({ deficiency })}
            busy={removal.processing}
        >
            <DeficiencyDetails deficiency={deficiency} />
            <DeficiencyDetailsActions
                deficiencyId={deficiency.id}
                permissions={can}
                deleting={removal.processing}
                onDelete={() => removal.open(deficiency)}
            />
            <DeficiencyDeleteModal
                deficiency={removal.target}
                context="details"
                processing={removal.processing}
                onClose={removal.close}
                onConfirm={() => removal.submit('delete', deficiencyUrls.destroy(deficiency.id))}
            />
        </BusinessPage>
    );
}
