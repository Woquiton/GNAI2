import PaeeDetails from '@/components/Paees/Details/PaeeDetails';
import PaeeDetailsActions from '@/components/Paees/Details/PaeeDetailsActions';
import PaeeDeleteModal from '@/components/Paees/PaeeDeleteModal';
import {
    paeeFailureTexts,
    paeeName,
    paeeTitle,
} from '@/components/Paees/Paees.constants';
import { paeeRecordBreadcrumb, paeeUrls } from '@/components/Paees/Paees.routes';
import { paeeShowTour } from '@/components/Paees/paeeTours';
import type { PaeeShowProps } from '@/components/Paees/Paees.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function PaeesShowPage({
    paee,
    student,
    can,
}: PaeeShowProps): React.JSX.Element {
    const removal = useConfirmedAction<string>({ failureText: paeeFailureTexts.delete });

    return (
        <BusinessPage
            title={paeeTitle(paee.version)}
            subtitle={`Aluno: ${student.name}`}
            breadcrumbItems={paeeRecordBreadcrumb(student, paee)}
            busy={removal.processing}
            tour={paeeShowTour}
        >
            <PaeeDetails paee={paee} can={can} />
            <PaeeDetailsActions
                paeeId={paee.id}
                studentId={student.id}
                permissions={can}
                deleting={removal.processing}
                onDelete={() => removal.open(paeeName({ version: paee.version, student }))}
            />
            <PaeeDeleteModal
                name={removal.target}
                processing={removal.processing}
                onClose={removal.close}
                onConfirm={() => removal.submit('delete', paeeUrls.destroy(paee.id))}
            />
        </BusinessPage>
    );
}
