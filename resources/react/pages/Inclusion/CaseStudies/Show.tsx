import {
    caseStudyFailureTexts,
    caseStudyName,
    caseStudyRecordDeleteMessage,
} from '@/components/Inclusion/CaseStudies/CaseStudies.constants';
import {
    caseStudyStudentBreadcrumb,
    caseStudyUrls,
} from '@/components/Inclusion/CaseStudies/CaseStudies.routes';
import type { CaseStudyShowProps } from '@/components/Inclusion/CaseStudies/CaseStudies.types';
import CaseStudyDeleteModal from '@/components/Inclusion/CaseStudies/CaseStudyDeleteModal';
import CaseStudyCompleteModal from '@/components/Inclusion/CaseStudies/Details/CaseStudyCompleteModal';
import CaseStudyDetails from '@/components/Inclusion/CaseStudies/Details/CaseStudyDetails';
import CaseStudyDetailsActions from '@/components/Inclusion/CaseStudies/Details/CaseStudyDetailsActions';
import { caseStudyShowTour } from '@/components/Inclusion/CaseStudies/caseStudyTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function InclusionCaseStudiesShowPage({
    student,
    caseStudy,
    can,
}: CaseStudyShowProps): React.JSX.Element {
    const title = caseStudyName({ version: caseStudy.version });
    const completion = useConfirmedAction<true>({ failureText: caseStudyFailureTexts.complete });
    const removal = useConfirmedAction<true>({ failureText: caseStudyFailureTexts.delete });

    return (
        <BusinessPage
            title={title}
            subtitle={`Aluno: ${student.name}`}
            tour={caseStudyShowTour}
            breadcrumbItems={caseStudyStudentBreadcrumb(student, { current: title })}
            busy={completion.processing || removal.processing}
        >
            <CaseStudyDetails student={student} caseStudy={caseStudy} can={can} />
            <CaseStudyDetailsActions
                caseStudyId={caseStudy.id}
                studentId={student.id}
                permissions={can}
                completing={completion.processing}
                deleting={removal.processing}
                onComplete={() => completion.open(true)}
                onDelete={() => removal.open(true)}
            />
            <CaseStudyCompleteModal
                open={completion.target !== null}
                processing={completion.processing}
                onClose={completion.close}
                onConfirm={() => completion.submit('patch', caseStudyUrls.complete(caseStudy.id))}
            />
            <CaseStudyDeleteModal
                open={removal.target !== null}
                message={caseStudyRecordDeleteMessage}
                processing={removal.processing}
                onClose={removal.close}
                onConfirm={() => removal.submit('delete', caseStudyUrls.destroy(caseStudy.id))}
            />
        </BusinessPage>
    );
}
