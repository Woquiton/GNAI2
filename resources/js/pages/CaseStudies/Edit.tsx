import { caseStudyStudentBreadcrumb } from '@/components/CaseStudies/CaseStudies.routes';
import type { CaseStudyFormProps } from '@/components/CaseStudies/CaseStudies.types';
import CaseStudyForm from '@/components/CaseStudies/Form/CaseStudyForm';
import { caseStudyEditTour } from '@/components/CaseStudies/caseStudyTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function CaseStudiesEditPage({
    student,
    caseStudy,
    options,
}: CaseStudyFormProps): React.JSX.Element {
    const title = caseStudy
        ? `Editar Estudo de Caso (v${caseStudy.version})`
        : 'Novo Estudo de Caso';

    return (
        <BusinessPage
            title={title}
            subtitle={`Aluno: ${student.name}`}
            tour={caseStudyEditTour}
            breadcrumbItems={caseStudyStudentBreadcrumb(student, {
                caseStudy: caseStudy ?? undefined,
                current: caseStudy ? 'Editar' : 'Novo Estudo de Caso',
            })}
        >
            <CaseStudyForm
                key={caseStudy?.id}
                student={student}
                caseStudy={caseStudy}
                options={options}
            />
        </BusinessPage>
    );
}
