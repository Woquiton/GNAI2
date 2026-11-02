import FormSection from '@/components/Forms/FormSection/FormSection';
import CardBox from '@/components/UI/CardBox/CardBox';
import DetailField from '@/components/UI/DetailField/DetailField';
import RecordSummary from '@/components/UI/RecordSummary/RecordSummary';
import type { TeacherPortalStudent, TeacherPortalStudentStatus } from '../TeacherPortal.types';
import TeacherPortalYesNo from './TeacherPortalYesNo';

interface TeacherPortalStudentSummaryProps {
    student: TeacherPortalStudent;
    status: TeacherPortalStudentStatus;
}

/** Identificação compacta do aluno com a existência de laudo, Estudo de Caso, PAEE e PEI. */
export default function TeacherPortalStudentSummary({
    student,
    status,
}: TeacherPortalStudentSummaryProps): React.JSX.Element {
    const photo = student.photo_url
        ? { src: student.photo_url, alt: `Foto de ${student.name}` }
        : undefined;

    return (
        <CardBox>
            <FormSection
                id="situacao-do-aluno"
                title="Situação do aluno"
                iconClass="fa fa-user"
                variant="inline"
            >
                <RecordSummary photo={photo} name={student.name}>
                    <DetailField label="Laudo">
                        <TeacherPortalYesNo value={status.has_laudo} />
                    </DetailField>
                    <DetailField label="Estudo de Caso">
                        <TeacherPortalYesNo value={status.has_case_study} />
                    </DetailField>
                    <DetailField label="PAEE">
                        <TeacherPortalYesNo value={status.has_paee} />
                    </DetailField>
                    <DetailField label="PEI">
                        <TeacherPortalYesNo value={status.has_pei} />
                    </DetailField>
                </RecordSummary>
            </FormSection>
        </CardBox>
    );
}
