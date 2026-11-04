import { useMemo } from 'react';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import FormActions from '@/components/Forms/FormActions/FormActions';
import { RichTextField } from '@/components/Forms/FormFields/FormFields';
import FormSection from '@/components/Forms/FormSection/FormSection';
import Button from '@/components/UI/Button/Button';
import { emailUrls } from '../Emails.routes';
import type { EmailComposeProps } from '../Emails.types';
import { EMAIL_TOUR_TARGETS } from '../emailTours';
import { useEmailComposer } from './useEmailComposer';

export default function EmailQuickReply({
    composer,
    sourceId,
    messageNumber,
}: {
    composer: EmailComposeProps['composer'];
    sourceId: string;
    messageNumber?: number;
}): React.JSX.Element {
    const { form, formRef, save, editorUnavailable, editorFailed } = useEmailComposer(composer);
    const toolbar = useMemo<Array<[string, string[]]>>(
        () => [
            ['style', ['bold', 'italic', 'underline']],
            ['para', ['ul', 'ol']],
            ['insert', ['link']],
        ],
        [],
    );

    return (
        <FormLayout
            ref={formRef}
            className="emailInbox__reply"
            aria-label="Responder mensagem"
            aria-busy={form.processing}
            onSubmit={(event) => {
                event.preventDefault();
                save('send');
            }}
        >
            <div className="emailInbox__replyContent">
                <FormSection
                    title={messageNumber ? `Responder à mensagem ${messageNumber}` : 'Responder'}
                    variant="inline"
                    iconClass="fa fa-reply"
                    tourTarget={EMAIL_TOUR_TARGETS.reply}
                >
                    <p className="emailInbox__muted">Para: {composer.to}</p>
                    <RichTextField
                        id="email-quick-reply"
                        label="Resposta"
                        required
                        defaultValue=""
                        height={200}
                        disabled={form.processing}
                        error={form.errors.body || form.errors.to || form.errors.subject}
                        toolbar={toolbar}
                        onLoadError={editorFailed}
                        onChange={(value) => form.setData('body', value)}
                    />
                </FormSection>
            </div>
            <FormActions
                status={form.processing ? 'Processando resposta...' : undefined}
                secondary={
                    <Button
                        href={emailUrls.respond(sourceId, 'reply')}
                        label="Editor completo"
                        title="Abrir resposta no editor completo"
                        tone="white"
                        leftIconClass="fa fa-pencil"
                        disabled={form.processing}
                    />
                }
            >
                <Button
                    href={emailUrls.index}
                    label="Voltar"
                    title="Voltar à Inbox"
                    tone="cancel"
                    disabled={form.processing}
                />
                <Button
                    href={emailUrls.respond(sourceId, 'forward')}
                    label="Encaminhar"
                    title="Encaminhar mensagem"
                    tone="white"
                    leftIconClass="fa fa-share"
                    disabled={form.processing}
                />
                <Button
                    label="Salvar rascunho"
                    title="Salvar resposta como rascunho"
                    tone="white"
                    leftIconClass="fa fa-floppy-o"
                    disabled={form.processing}
                    onClick={() => save('draft')}
                />
                <Button
                    type="submit"
                    label="Enviar resposta"
                    title="Enviar resposta"
                    tone="save"
                    leftIconClass="fa fa-paper-plane"
                    disabled={form.processing || editorUnavailable}
                />
            </FormActions>
        </FormLayout>
    );
}
