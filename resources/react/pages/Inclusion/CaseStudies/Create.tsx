import { caseStudyStudentBreadcrumb } from '@/components/Inclusion/CaseStudies/CaseStudies.routes';
import type { CaseStudyFormProps } from '@/components/Inclusion/CaseStudies/CaseStudies.types';
import CaseStudyForm from '@/components/Inclusion/CaseStudies/Form/CaseStudyForm';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionCaseStudiesCreatePage({
    student,
    options,
}: CaseStudyFormProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Novo Estudo de Caso"
            subtitle={`Aluno: ${student.name}`}
            breadcrumbItems={caseStudyStudentBreadcrumb(student, {
                current: 'Novo Estudo de Caso',
            })}
        >
            <CaseStudyForm student={student} caseStudy={null} options={options} />
        </BusinessPage>
    );
}
