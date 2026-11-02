import {
    caseStudiesTab,
    caseStudyStudentBreadcrumb,
} from '@/components/Inclusion/CaseStudies/CaseStudies.routes';
import type { CaseStudyHistoryProps } from '@/components/Inclusion/CaseStudies/CaseStudies.types';
import CaseStudyHistoryList from '@/components/Inclusion/CaseStudies/List/CaseStudyHistoryList';
import StudentRecordReturnButton from '@/components/Inclusion/Students/StudentRecordReturnButton';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionCaseStudiesHistoryPage({
    student,
    caseStudies,
    can,
}: CaseStudyHistoryProps): React.JSX.Element {
    return (
        <BusinessPage
            title={`Histórico de Estudos de Caso de ${student.name}`}
            breadcrumbItems={caseStudyStudentBreadcrumb(student, {
                current: 'Histórico de Estudos de Caso',
            })}
            actions={<StudentRecordReturnButton studentId={student.id} tab={caseStudiesTab} />}
        >
            <CaseStudyHistoryList caseStudies={caseStudies} permissions={can} />
        </BusinessPage>
    );
}
