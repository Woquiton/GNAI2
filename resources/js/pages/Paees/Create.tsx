import PaeeForm from '@/components/Paees/Form/PaeeForm';
import { paeeVersionLabel } from '@/components/Paees/Paees.constants';
import { paeeStudentBreadcrumb } from '@/components/Paees/Paees.routes';
import { paeeCreateTour } from '@/components/Paees/paeeTours';
import type { PaeeCreateProps } from '@/components/Paees/Paees.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function PaeesCreatePage({
    caseStudy,
    student,
    options,
}: PaeeCreateProps): React.JSX.Element {
    const subtitle = `Aluno: ${student.name} • a partir do Estudo de Caso ${paeeVersionLabel(caseStudy.version)}`;

    return (
        <BusinessPage
            title="Novo PAEE"
            subtitle={subtitle}
            breadcrumbItems={paeeStudentBreadcrumb(student, { current: 'Novo PAEE' })}
            tour={paeeCreateTour}
        >
            <PaeeForm mode="create" caseStudyId={caseStudy.id} options={options} />
        </BusinessPage>
    );
}
