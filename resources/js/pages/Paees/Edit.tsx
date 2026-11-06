import PaeeForm from '@/components/Paees/Form/PaeeForm';
import { paeeVersionLabel } from '@/components/Paees/Paees.constants';
import { paeeRecordBreadcrumb } from '@/components/Paees/Paees.routes';
import { paeeEditTour } from '@/components/Paees/paeeTours';
import type { PaeeEditProps } from '@/components/Paees/Paees.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function PaeesEditPage({
    paee,
    student,
    options,
}: PaeeEditProps): React.JSX.Element {
    return (
        <BusinessPage
            title={`Editar PAEE (${paeeVersionLabel(paee.version)})`}
            subtitle={`Aluno: ${student.name}`}
            breadcrumbItems={paeeRecordBreadcrumb(student, paee, 'Editar PAEE')}
            tour={paeeEditTour}
        >
            <PaeeForm key={paee.id} mode="edit" paee={paee} options={options} />
        </BusinessPage>
    );
}
