import type { ProfessionalViewerProps } from '@/components/Inclusion/Professionals/Professionals.types';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import ProfessionalDetails from '@/components/Inclusion/Professionals/Details/ProfessionalDetails';
import ProfessionalDetailsActions from '@/components/Inclusion/Professionals/Details/ProfessionalDetailsActions';
import ProfessionalDeleteModal from '@/components/Inclusion/Professionals/ProfessionalDeleteModal';
import {
    professionalBreadcrumb,
    professionalUrls,
} from '@/components/Inclusion/Professionals/Professionals.routes';
import type { ProfessionalShowProps } from '@/components/Inclusion/Professionals/Professionals.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function InclusionProfessionalsShowPage({
    professional,
    display,
    impersonationUserId,
    can,
}: ProfessionalShowProps): React.JSX.Element {
    const viewerIsAdmin = usePage<ProfessionalViewerProps>().props.auth?.user?.is_admin === true;
    const [impersonating, setImpersonating] = useState(false);
    const removal = useConfirmedAction<{ name: string }>({
        failureText: 'Não foi possível excluir o profissional. Tente novamente.',
    });
    const { name } = professional.person;

    return (
        <BusinessPage
            title="Perfil do Profissional"
            subtitle="Visualize os dados pessoais e funcionais do profissional ou tutor de pares. Embora esta seção esteja sob o título “Profissionais”, os tutores de pares também são exibidos e gerenciados aqui."
            documentTitle={name}
            breadcrumbItems={professionalBreadcrumb({ current: name })}
            busy={removal.processing || impersonating}
        >
            <ProfessionalDetails
                professional={professional}
                display={display}
                showAdministrator={viewerIsAdmin}
            />
            <ProfessionalDetailsActions
                professionalId={professional.id}
                name={name}
                impersonationUserId={impersonationUserId}
                permissions={can}
                deleting={removal.processing}
                busy={removal.processing || impersonating}
                onImpersonatingChange={setImpersonating}
                onDelete={() => removal.open({ name })}
            />
            <ProfessionalDeleteModal
                target={removal.target}
                context="details"
                processing={removal.processing}
                onClose={removal.close}
                onConfirm={() =>
                    removal.submit('delete', professionalUrls.destroy(professional.id))
                }
            />
        </BusinessPage>
    );
}
