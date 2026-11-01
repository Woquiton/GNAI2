import PaeeForm from '@/components/Inclusion/Paees/Form/PaeeForm';
import { paeeVersionLabel } from '@/components/Inclusion/Paees/Paees.constants';
import { paeeRecordBreadcrumb } from '@/components/Inclusion/Paees/Paees.routes';
import type { PaeeEditProps } from '@/components/Inclusion/Paees/Paees.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionPaeesEditPage({
    paee,
    student,
}: PaeeEditProps): React.JSX.Element {
    return (
        <BusinessPage
            title={`Editar PAEE (${paeeVersionLabel(paee.version)})`}
            subtitle={`Aluno: ${student.name}`}
            breadcrumbItems={paeeRecordBreadcrumb(student, paee, 'Editar PAEE')}
        >
            <PaeeForm key={paee.id} mode="edit" paee={paee} />
        </BusinessPage>
    );
}
