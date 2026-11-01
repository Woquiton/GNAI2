import { caseStudyStudentBreadcrumb } from '@/components/Inclusion/CaseStudies/CaseStudies.routes';
import type { CaseStudyFormProps } from '@/components/Inclusion/CaseStudies/CaseStudies.types';
import CaseStudyForm from '@/components/Inclusion/CaseStudies/Form/CaseStudyForm';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionCaseStudiesEditPage({
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
