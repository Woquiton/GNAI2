import FormSection from '@/components/Forms/FormSection/FormSection';
import CardBox from '@/components/UI/CardBox/CardBox';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import RichTextContent from '@/components/UI/RichTextContent/RichTextContent';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import type { PedagogicalRecordShowProps } from '../PedagogicalRecords.types';

type PedagogicalRecordDetailsProps = Pick<
    PedagogicalRecordShowProps,
    'pedagogicalRecord' | 'session'
>;

/** Texto rico já sanitizado pelo servidor; conteúdo vazio aparece como não informado. */
function richTextOrFallback(html: string | null, fallback: string): React.JSX.Element {
    return <RichTextContent html={html?.trim() || fallback} />;
}

/** Identificação da sessão e conteúdo do acompanhamento pedagógico registrado. */
export default function PedagogicalRecordDetails({
    pedagogicalRecord: record,
    session,
}: PedagogicalRecordDetailsProps): React.JSX.Element {
    const showPedagogicalContent = record.is_present || record.has_guardians;
    const schedule = `${session.start_time ?? '--:--'} às ${session.end_time ?? '--:--'}`;
    const presenceTone = record.is_present ? 'success' : 'danger';
    const presenceIcon = record.is_present
        ? 'fa fa-check-circle m-r-5'
        : 'fa fa-times-circle m-r-5';
    const presenceLabel = record.is_present ? 'Presente' : 'Ausente';

    return (
        <CardBox>
            <FormSection
                id="pedagogical-record-show-identification"
                title="Identificação do Estudante"
                variant="inline"
                iconClass="fa fa-user"
            >
                <DetailGrid>
                    <DetailField label="Aluno">
                        {session.student_name ?? 'Aluno não informado'}
                    </DetailField>
                    <DetailField label="Profissional">
                        {session.professional_name ?? 'Profissional não informado'}
                    </DetailField>
                    <DetailField label="Horário" wide>
                        {schedule}
                    </DetailField>
                    {record.has_guardians ? (
                        <DetailField label="Responsáveis participantes" wide>
                            {record.guardian_names}
                        </DetailField>
                    ) : null}
                </DetailGrid>
            </FormSection>
            <FormSection
                id="pedagogical-record-show-follow-up"
                title="Acompanhamento Pedagógico"
                variant="inline"
                iconClass="fa fa-book"
            >
                <DetailGrid>
                    <DetailField label="Motivo do Acompanhamento" wide>
                        {richTextOrFallback(record.follow_up_reason, 'Não informado.')}
                    </DetailField>
                    <DetailField label="Período/Duração do Acompanhamento">
                        {record.duration || 'Não informado'}
                    </DetailField>
                    <DetailField label="Presença do Estudante no Atendimento">
                        <TableLabel tone={presenceTone}>
                            <i className={presenceIcon} aria-hidden="true" />
                            {presenceLabel}
                        </TableLabel>
                    </DetailField>
                    {!record.is_present ? (
                        <DetailField label="Motivo da Ausência" wide>
                            {richTextOrFallback(record.absence_reason, 'Não informado.')}
                        </DetailField>
                    ) : null}
                    {showPedagogicalContent ? (
                        <>
                            <DetailField
                                label="Registro do Acompanhamento Pedagógico Sistemático"
                                wide
                            >
                                {richTextOrFallback(
                                    record.systematic_pedagogical_follow_up_record,
                                    'Não informado',
                                )}
                            </DetailField>
                            <DetailField
                                label="Estratégias e Recursos Adotados (quando necessário)"
                                wide
                            >
                                {richTextOrFallback(record.strategies_and_resources_adopted, 'N/A')}
                            </DetailField>
                            <DetailField label="Encaminhamentos Realizados" wide>
                                {richTextOrFallback(record.referrals_made, 'N/A')}
                            </DetailField>
                            <DetailField label="Observações Complementares" wide>
                                {richTextOrFallback(record.complementary_observations, 'N/A')}
                            </DetailField>
                        </>
                    ) : null}
                </DetailGrid>
            </FormSection>
        </CardBox>
    );
}
