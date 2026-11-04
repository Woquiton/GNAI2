import FormSection from '@/components/Forms/FormSection/FormSection';
import CardBox from '@/components/UI/CardBox/CardBox';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import EmptyText from '@/components/UI/EmptyText/EmptyText';
import InlineAlert from '@/components/UI/InlineAlert/InlineAlert';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { emailStatusDescriptions, emailStatusTones } from '../Emails.constants';
import type { EmailDetails as EmailDetailsRecord } from '../Emails.types';
import { EMAIL_TOUR_TARGETS } from '../emailTours';

export default function EmailDetails({ email }: { email: EmailDetailsRecord }): React.JSX.Element {
    const content = email.content;
    const hasContent = Boolean(
        content.greeting || content.paragraphs.length || content.rows.length || content.outro,
    );

    return (
        <CardBox>
            <FormSection
                variant="inline"
                title="Resultado do envio"
                iconClass="fa fa-envelope-o"
                tourTarget={EMAIL_TOUR_TARGETS.tracking}
            >
                <DetailGrid>
                    <DetailField label="Assunto" wide>
                        {email.subject}
                    </DetailField>
                    <DetailField label="Destinatário">
                        {email.recipient_name || 'Não informado'}
                    </DetailField>
                    <DetailField label="E-mail">
                        {email.recipient_email || 'Sem endereço válido'}
                    </DetailField>
                    <DetailField label="Status">
                        <TableLabel tone={emailStatusTones[email.delivery.status]}>
                            {email.delivery.label}
                        </TableLabel>
                    </DetailField>
                    <DetailField label="Origem">{email.context_label}</DetailField>
                    <DetailField label="Finalidade">{email.purpose_label}</DetailField>
                    <DetailField label="Tentativas">{email.attempts}</DetailField>
                    <DetailField label="Registrado em">
                        {email.created_at_label || 'Não informado'}
                    </DetailField>
                    <DetailField label="Última tentativa">
                        {email.last_attempt_at_label || 'Sem tentativa registrada'}
                    </DetailField>
                    <DetailField label="Enviado em">
                        {email.delivery.sent_at_label || 'Sem envio confirmado'}
                    </DetailField>
                </DetailGrid>
                <InlineAlert variant="info">{emailStatusDescriptions[email.delivery.status]}</InlineAlert>
            </FormSection>
            <FormSection
                variant="inline"
                title="Mensagem"
                iconClass="fa fa-file-text-o"
                tourTarget={EMAIL_TOUR_TARGETS.content}
            >
                {content.greeting ? <p>{content.greeting}</p> : null}
                {content.paragraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
                {content.rows.length ? (
                    <DetailGrid>
                        {content.rows.map((row, index) => (
                            <DetailField key={index} label={row.label} preserveLineBreaks>
                                {row.value}
                            </DetailField>
                        ))}
                    </DetailGrid>
                ) : null}
                {content.outro ? <p>{content.outro}</p> : null}
                {!hasContent ? (
                    <EmptyText>Conteúdo não disponível nesta consulta.</EmptyText>
                ) : null}
                {content.links_omitted ? (
                    <InlineAlert variant="info">
                        Os links de acesso e redefinição de senha são enviados somente ao destinatário
                        e não aparecem nesta consulta.
                    </InlineAlert>
                ) : null}
            </FormSection>
        </CardBox>
    );
}
