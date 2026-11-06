import { caseStudyStudentBreadcrumb } from '@/components/CaseStudies/CaseStudies.routes';
import type { CaseStudyFormProps } from '@/components/CaseStudies/CaseStudies.types';
import CaseStudyForm from '@/components/CaseStudies/Form/CaseStudyForm';
import { caseStudyCreateTour } from '@/components/CaseStudies/caseStudyTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function CaseStudiesCreatePage({
    student,
    options,
}: CaseStudyFormProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Novo Estudo de Caso"
            subtitle={`Aluno: ${student.name}`}
            tour={caseStudyCreateTour}
            breadcrumbItems={caseStudyStudentBreadcrumb(student, {
                current: 'Novo Estudo de Caso',
            })}
        >
            <CaseStudyForm student={student} caseStudy={null} options={options} />
        </BusinessPage>
    );
}
