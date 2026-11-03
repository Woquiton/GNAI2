import GuardianDetails from '@/components/Inclusion/Guardians/Details/GuardianDetails';
import GuardianDetailsActions from '@/components/Inclusion/Guardians/Details/GuardianDetailsActions';
import GuardianDeleteModal from '@/components/Inclusion/Guardians/GuardianDeleteModal';
import {
    guardianBreadcrumb,
    guardianUrls,
} from '@/components/Inclusion/Guardians/Guardians.routes';
import type {
    GuardianRecord,
    GuardianShowProps,
} from '@/components/Inclusion/Guardians/Guardians.types';
import { guardianShowTour } from '@/components/Inclusion/Guardians/guardianTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function InclusionGuardiansShowPage({
    can,
    ...details
}: GuardianShowProps): React.JSX.Element {
    const { guardian, student } = details;
    const removal = useConfirmedAction<GuardianRecord>({
        failureText: 'Não foi possível excluir o responsável. Tente novamente.',
    });

    return (
        <BusinessPage
            title="Dados do Responsável"
            subtitle={`Responsável por: ${student.person.name}`}
            documentTitle={guardian.person.name}
            breadcrumbItems={guardianBreadcrumb({ student, current: guardian.person.name })}
            busy={removal.processing}
            tour={guardianShowTour}
        >
            <GuardianDetails {...details} />
            <GuardianDetailsActions
                studentId={student.id}
                guardianId={guardian.id}
                permissions={can}
                deleting={removal.processing}
                onDelete={() => removal.open(guardian)}
            />
            <GuardianDeleteModal
                guardian={removal.target}
                context="details"
                processing={removal.processing}
                onClose={removal.close}
                onConfirm={() =>
                    removal.submit('delete', guardianUrls(student.id).destroy(guardian.id))
                }
            />
        </BusinessPage>
    );
}
