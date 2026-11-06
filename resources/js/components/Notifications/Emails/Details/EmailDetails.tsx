import FormSection from '@/components/Forms/FormSection/FormSection';
import { Link } from '@inertiajs/react';
import { emailUrls } from '../Emails.routes';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import EmptyText from '@/components/UI/EmptyText/EmptyText';
import InlineAlert from '@/components/UI/InlineAlert/InlineAlert';
import RichTextContent from '@/components/UI/RichTextContent/RichTextContent';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { emailStatusTones } from '../Emails.constants';
import EmailDeliveryTracking from './EmailDeliveryTracking';
import type { EmailDetails as EmailDetailsRecord } from '../Emails.types';
import { EMAIL_TOUR_TARGETS } from '../emailTours';

export default function EmailDetails({
    email,
    tourEnabled = true,
}: {
    email: EmailDetailsRecord;
    tourEnabled?: boolean;
}): React.JSX.Element {
    const content = email.content;
    const notices = email.notices ?? [];
    const senderLabel =
        email.sender_name || (email.direction === 'incoming' ? email.sender_address : 'Gnai');
    const hasContent = Boolean(
        email.body_html ||
        content.greeting ||
        content.paragraphs.length ||
        content.rows.length ||
        content.outro,
    );

    return (
        <article className="emailInbox__read" aria-labelledby={`email-subject-${email.id}`}>
            <header className="emailInbox__readHeader">
                <h2 id={`email-subject-${email.id}`}>{email.subject || '(Sem assunto)'}</h2>
                <TableLabel tone={emailStatusTones[email.delivery.status]}>
                    {email.delivery.label}
                </TableLabel>
            </header>
            <div className="emailInbox__sender">
                <span className="emailInbox__senderAvatar" aria-hidden="true">
                    <i className="fa fa-user" />
                </span>
                <div>
                    <strong>{senderLabel}</strong>
                    <p>
                        {email.sender_address
                            ? `De: ${email.sender_address}`
                            : 'Mensagem registrada pelo Gnai'}
                    </p>
                    <p>
                        Para: {email.to.join(', ') || email.recipient_email || 'Sem destinatário'}
                    </p>
                    {email.cc.length > 0 ? <p>Cc: {email.cc.join(', ')}</p> : null}
                    {email.bcc.length > 0 ? <p>Cco: {email.bcc.join(', ')}</p> : null}
                </div>
                <time>{email.delivery.sent_at_label || email.created_at_label}</time>
            </div>
            {email.in_reply_to ? (
                <p className="emailInbox__muted">
                    Em resposta a:{' '}
                    <Link href={emailUrls.show(email.in_reply_to.id)}>
                        {email.in_reply_to.subject || '(Sem assunto)'}
                    </Link>
                </p>
            ) : null}
            {notices.map((notice) => (
                <InlineAlert key={notice} variant="info">
                    {notice}
                </InlineAlert>
            ))}
            <section
                className="emailInbox__body"
                aria-label="Conteúdo da mensagem"
                data-tour={tourEnabled ? EMAIL_TOUR_TARGETS.content : undefined}
            >
                {email.body_html ? (
                    <RichTextContent html={email.body_html} />
                ) : (
                    <>
                        {content.greeting ? <p>{content.greeting}</p> : null}
                        {content.paragraphs.map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                        {content.rows.length > 0 ? (
                            <DetailGrid>
                                {content.rows.map((row, index) => (
                                    <DetailField key={index} label={row.label} preserveLineBreaks>
                                        {row.value}
                                    </DetailField>
                                ))}
                            </DetailGrid>
                        ) : null}
                        {content.outro ? <p>{content.outro}</p> : null}
                    </>
                )}
                {!hasContent ? (
                    <EmptyText>Conteúdo não disponível nesta consulta.</EmptyText>
                ) : null}
                {content.links_omitted ? (
                    <InlineAlert variant="info">
                        Os links de acesso e redefinição de senha são restritos ao destinatário e
                        não aparecem nesta consulta.
                    </InlineAlert>
                ) : null}
            </section>
            {email.attachments.length > 0 ? (
                <FormSection
                    title={`Anexos (${email.attachments.length})`}
                    iconClass="fa fa-paperclip"
                    variant="inline"
                    tourTarget={tourEnabled ? EMAIL_TOUR_TARGETS.attachments : undefined}
                >
                    <ul className="emailInbox__attachments">
                        {email.attachments.map((file) => (
                            <li key={file.index}>
                                <a href={file.url}>
                                    <i className="fa fa-file-o" aria-hidden="true" />
                                    <span>{file.name}</span>
                                    <small>
                                        {Math.max(1, Math.round(file.size / 1024))} KB · Baixar
                                    </small>
                                </a>
                            </li>
                        ))}
                    </ul>
                </FormSection>
            ) : null}
            <EmailDeliveryTracking email={email} tourEnabled={tourEnabled} />
        </article>
    );
}
