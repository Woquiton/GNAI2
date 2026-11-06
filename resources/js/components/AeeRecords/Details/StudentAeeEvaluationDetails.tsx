import FormSection from '@/components/Forms/FormSection/FormSection';
import CardBox from '@/components/UI/CardBox/CardBox';
import type { AeeStudentEvaluationWithRecord } from '../AeeRecords.types';
import { AEE_RECORD_TOUR_TARGETS } from '../aeeRecordTours';
import AeeEvaluationDetails from './AeeEvaluationDetails';
import AeeRecordExecutionDetails from './AeeRecordExecutionDetails';

interface StudentAeeEvaluationDetailsProps {
    evaluation: AeeStudentEvaluationWithRecord;
    studentName: string;
}

/** Avaliação do aluno aberta pelo prontuário, com a execução do atendimento a que pertence. */
export default function StudentAeeEvaluationDetails({
    evaluation,
    studentName,
}: StudentAeeEvaluationDetailsProps): React.JSX.Element {
    return (
        <CardBox>
            <AeeRecordExecutionDetails
                id="student-aee-execution"
                aeeRecord={evaluation.aee_record}
            />
            <FormSection
                id="student-aee-evaluation"
                tourTarget={AEE_RECORD_TOUR_TARGETS.studentDetailsEvaluation}
                title="Avaliação Individual do Aluno"
                variant="inline"
                iconClass="fa fa-user"
            >
                <AeeEvaluationDetails evaluation={evaluation} studentName={studentName} />
            </FormSection>
        </CardBox>
    );
}
