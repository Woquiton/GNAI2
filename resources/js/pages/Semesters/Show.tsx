import SemesterDetails from '@/components/Semesters/Details/SemesterDetails';
import SemesterDetailsActions from '@/components/Semesters/Details/SemesterDetailsActions';
import SemesterDeleteModal from '@/components/Semesters/SemesterDeleteModal';
import { semesterLabel } from '@/components/Semesters/Semesters.constants';
import {
    semesterBreadcrumb,
    semesterUrls,
} from '@/components/Semesters/Semesters.routes';
import type { SemesterShowProps } from '@/components/Semesters/Semesters.types';
import { semesterShowTour } from '@/components/Semesters/semesterTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function SemestersShowPage({
    semester,
    can,
}: SemesterShowProps): React.JSX.Element {
    const removal = useConfirmedAction<typeof semester>({
        failureText: 'Não foi possível excluir o semestre. Tente novamente.',
    });

    return (
        <BusinessPage
            title="Detalhes do Semestre"
            subtitle="Configuração do período letivo e vigência dos atendimentos."
            documentTitle={`Semestre ${semesterLabel(semester)}`}
            breadcrumbItems={semesterBreadcrumb({ semester })}
            busy={removal.processing}
            tour={semesterShowTour}
        >
            <SemesterDetails semester={semester} />
            <SemesterDetailsActions
                semesterId={semester.id}
                permissions={can}
                isCurrent={semester.is_current}
                deleting={removal.processing}
                onDelete={() => removal.open(semester)}
            />
            <SemesterDeleteModal
                semester={removal.target}
                warnLinkedRecords
                processing={removal.processing}
                onClose={removal.close}
                onConfirm={() => removal.submit('delete', semesterUrls.destroy(semester.id))}
            />
        </BusinessPage>
    );
}
