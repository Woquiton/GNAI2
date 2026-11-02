import FormSection from '@/components/Forms/FormSection/FormSection';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import RichTextContent from '@/components/UI/RichTextContent/RichTextContent';
import { aeeTextValue } from '../AeeRecords.constants';
import type { AeeRecordRecord } from '../AeeRecords.types';

interface AeeRecordExecutionDetailsProps {
    id: string;
    aeeRecord: AeeRecordRecord;
}

/** Dados gerais da execução do atendimento, comuns ao registro completo e à avaliação do aluno. */
export default function AeeRecordExecutionDetails({
    id,
    aeeRecord,
}: AeeRecordExecutionDetailsProps): React.JSX.Element {
    return (
        <FormSection
            id={id}
            title="Execução do Atendimento AEE"
            variant="inline"
            iconClass="fa fa-clipboard"
        >
            <DetailGrid columns={3}>
                <DetailField label="Duração">{aeeRecord.duration || 'N/A'}</DetailField>
            </DetailGrid>
            <DetailGrid>
                <DetailField label="Atividades Realizadas" wide>
                    <RichTextContent html={aeeTextValue(aeeRecord.activities_performed)} />
                </DetailField>
                <DetailField label="Estratégias Utilizadas">
                    <RichTextContent html={aeeTextValue(aeeRecord.strategies_used)} />
                </DetailField>
                <DetailField label="Recursos Utilizados">
                    <RichTextContent html={aeeTextValue(aeeRecord.resources_used)} />
                </DetailField>
                <DetailField label="Observações Gerais" wide>
                    <RichTextContent html={aeeTextValue(aeeRecord.general_observations)} />
                </DetailField>
            </DetailGrid>
        </FormSection>
    );
}
