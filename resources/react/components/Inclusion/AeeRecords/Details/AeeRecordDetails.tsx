import FormSection from '@/components/Forms/FormSection/FormSection';
import type { TabItem } from '@/components/Navigation/Tabs/Tabs';
import CardBox from '@/components/UI/CardBox/CardBox';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { aeeStudentName } from '../AeeRecords.constants';
import type { AeeRecordRecord } from '../AeeRecords.types';
import AeeEvaluationTabs, { AeeEvaluationTabLabel } from '../AeeEvaluationTabs';
import { AEE_RECORD_TOUR_TARGETS } from '../aeeRecordTours';
import AeeEvaluationDetails from './AeeEvaluationDetails';
import AeeRecordExecutionDetails from './AeeRecordExecutionDetails';

interface AeeRecordDetailsProps {
    aeeRecord: AeeRecordRecord;
}

/** Registro completo: execução do atendimento e uma aba de desempenho por aluno. */
export default function AeeRecordDetails({ aeeRecord }: AeeRecordDetailsProps): React.JSX.Element {
    const tabs: TabItem[] = (aeeRecord.student_evaluations ?? []).map((evaluation) => {
        const name = aeeStudentName(evaluation.student, evaluation.student_id);

        return {
            id: `evaluation-${evaluation.id}`,
            label: (
                <AeeEvaluationTabLabel name={name}>
                    {!evaluation.is_present ? <TableLabel tone="danger">Falta</TableLabel> : null}
                </AeeEvaluationTabLabel>
            ),
            content: <AeeEvaluationDetails evaluation={evaluation} studentName={name} />,
        };
    });

    return (
        <CardBox>
            <AeeRecordExecutionDetails id="aee-record-execution" aeeRecord={aeeRecord} />
            <FormSection
                id="aee-record-evaluations"
                tourTarget={AEE_RECORD_TOUR_TARGETS.evaluations}
                title="Desempenho Individual"
                variant="inline"
                iconClass="fa fa-users"
            >
                <AeeEvaluationTabs
                    items={tabs}
                    emptyMessage="Nenhuma avaliação individual registrada."
                />
            </FormSection>
        </CardBox>
    );
}
