import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { aeeTextValue } from '../AeeRecords.constants';
import type { AeeStudentEvaluationRecord } from '../AeeRecords.types';
import { AeeEvaluationTitle } from '../AeeEvaluationTabs';

interface AeeEvaluationDetailsProps {
    evaluation: AeeStudentEvaluationRecord;
    studentName: string;
}

/** Desempenho do aluno presente ou motivo da ausência, como textos simples. */
export default function AeeEvaluationDetails({
    evaluation,
    studentName,
}: AeeEvaluationDetailsProps): React.JSX.Element {
    const present = Boolean(evaluation.is_present);
    const presenceLabel = present ? 'Presente' : 'Aluno Ausente';

    return (
        <>
            <AeeEvaluationTitle studentName={studentName} />
            <DetailGrid>
                <DetailField label="Presença" wide>
                    <TableLabel tone={present ? 'success' : 'danger'}>{presenceLabel}</TableLabel>
                </DetailField>
                {present ? (
                    <>
                        <DetailField label="Participação" wide preserveLineBreaks>
                            {aeeTextValue(evaluation.student_participation)}
                        </DetailField>
                        <DetailField label="Adaptações Realizadas" wide preserveLineBreaks>
                            {aeeTextValue(
                                evaluation.adaptations_made,
                                'Nenhuma adaptação informada.',
                            )}
                        </DetailField>
                        <DetailField label="Avaliação do Desenvolvimento" wide preserveLineBreaks>
                            {aeeTextValue(evaluation.development_evaluation)}
                        </DetailField>
                        <DetailField label="Indicadores de Progresso" wide preserveLineBreaks>
                            {aeeTextValue(evaluation.progress_indicators)}
                        </DetailField>
                        <DetailField label="Recomendações" preserveLineBreaks>
                            {aeeTextValue(evaluation.recommendations, 'Nenhuma recomendação.')}
                        </DetailField>
                        <DetailField
                            label="Ajustes para Próximo atendimento AEE"
                            preserveLineBreaks
                        >
                            {aeeTextValue(evaluation.next_session_adjustments)}
                        </DetailField>
                    </>
                ) : (
                    <DetailField label="Motivo" wide preserveLineBreaks>
                        {aeeTextValue(evaluation.absence_reason, 'Não justificado.')}
                    </DetailField>
                )}
            </DetailGrid>
        </>
    );
}
