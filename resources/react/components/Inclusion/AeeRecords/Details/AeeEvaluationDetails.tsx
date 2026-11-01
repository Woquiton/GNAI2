import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import RichTextContent from '@/components/UI/RichTextContent/RichTextContent';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { aeeTextValue } from '../AeeRecords.constants';
import type { AeeStudentEvaluationRecord } from '../AeeRecords.types';
import { AeeEvaluationTitle } from '../AeeEvaluationTabs';

interface AeeEvaluationDetailsProps {
    evaluation: AeeStudentEvaluationRecord;
    studentName: string;
}

/** Texto rico já sanitizado pelo servidor, com o substituto do legado quando vazio. */
function richText(value: string | null, fallback?: string): React.JSX.Element {
    return <RichTextContent html={aeeTextValue(value, fallback)} />;
}

/** Desempenho do aluno presente ou motivo da ausência, em HTML sanitizado pelo servidor. */
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
                        <DetailField label="Participação" wide>
                            {richText(evaluation.student_participation)}
                        </DetailField>
                        <DetailField label="Adaptações Realizadas" wide>
                            {richText(evaluation.adaptations_made, 'Nenhuma adaptação informada.')}
                        </DetailField>
                        <DetailField label="Avaliação do Desenvolvimento" wide>
                            {richText(evaluation.development_evaluation)}
                        </DetailField>
                        <DetailField label="Indicadores de Progresso" wide>
                            {richText(evaluation.progress_indicators)}
                        </DetailField>
                        <DetailField label="Recomendações">
                            {richText(evaluation.recommendations, 'Nenhuma recomendação.')}
                        </DetailField>
                        <DetailField label="Ajustes para Próximo atendimento AEE">
                            {richText(evaluation.next_session_adjustments)}
                        </DetailField>
                    </>
                ) : (
                    <DetailField label="Motivo" wide>
                        {richText(evaluation.absence_reason, 'Não justificado.')}
                    </DetailField>
                )}
            </DetailGrid>
        </>
    );
}
