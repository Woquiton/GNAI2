import PaeeForm from '@/components/Inclusion/Paees/Form/PaeeForm';
import { paeeVersionLabel } from '@/components/Inclusion/Paees/Paees.constants';
import { paeeStudentBreadcrumb } from '@/components/Inclusion/Paees/Paees.routes';
import type { PaeeCreateProps } from '@/components/Inclusion/Paees/Paees.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionPaeesCreatePage({
    caseStudy,
    student,
}: PaeeCreateProps): React.JSX.Element {
    const subtitle = `Aluno: ${student.name} • a partir do Estudo de Caso ${paeeVersionLabel(caseStudy.version)}`;

    return (
        <BusinessPage
            title="Novo PAEE"
            subtitle={subtitle}
            breadcrumbItems={paeeStudentBreadcrumb(student, { current: 'Novo PAEE' })}
        >
            <PaeeForm mode="create" caseStudyId={caseStudy.id} />
        </BusinessPage>
    );
}
