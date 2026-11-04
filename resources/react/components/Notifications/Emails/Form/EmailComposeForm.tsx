import { useMemo, useState } from 'react';
import { router } from '@inertiajs/react';
import EvidenceUpload from '@/components/Forms/EvidenceUpload/EvidenceUpload';
import FormActions from '@/components/Forms/FormActions/FormActions';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import { RichTextField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormStack } from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';
import { emailUrls } from '../Emails.routes';
import type { EmailComposeProps } from '../Emails.types';
import { EMAIL_TOUR_TARGETS } from '../emailTours';
import { useEmailComposer } from './useEmailComposer';
import EmailRecipientsField from './EmailRecipientsField';

export default function EmailComposeForm({
    composer,
}: Pick<EmailComposeProps, 'composer'>): React.JSX.Element {
    const { form, formRef, save, attachmentError, editorFailed, editorUnavailable } =
        useEmailComposer(composer);
    const [discarding, setDiscarding] = useState(false);
    const existing = composer.attachments.filter(
        (file) => !form.data.removed_attachments.includes(file.index),
    );
    const toolbar = useMemo<Array<[string, string[]]>>(
        () => [
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['font', ['fontsize', 'color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['insert', ['link', 'table']],
            ['view', ['fullscreen']],
        ],
        [],
    );

    return (
        <>
            <FormLayout
                ref={formRef}
                className="emailInbox__compose"
                aria-label="Escrever e-mail"
                aria-busy={form.processing}
                onSubmit={(event) => {
                    event.preventDefault();
                    save('send');
                }}
            >
                <CardBox>
                    <fieldset disabled={form.processing}>
                        <FormSection
                            title="Nova mensagem"
                            iconClass="fa fa-pencil"
                            variant="inline"
                            tourTarget={EMAIL_TOUR_TARGETS.compose}
                        >
                            <FormStack>
                                <p className="emailInbox__muted">De: {composer.sender}</p>
                                <EmailRecipientsField
                                    id="email-compose-to"
                                    name="to"
                                    label="Para"
                                    required
                                    value={form.data.to}
                                    error={form.errors.to}
                                    disabled={form.processing}
                                    onChange={(value) => form.setData('to', value)}
                                />
                                <FormGrid>
                                    <EmailRecipientsField
                                        id="email-compose-cc"
                                        name="cc"
                                        label="Cc"
                                        value={form.data.cc}
                                        error={form.errors.cc}
                                        disabled={form.processing}
                                        hint="Destinatários em cópia. Use + E-mail para adicionar outra cópia."
                                        onChange={(value) => form.setData('cc', value)}
                                    />
                                    <EmailRecipientsField
                                        id="email-compose-bcc"
                                        name="bcc"
                                        label="Cco"
                                        value={form.data.bcc}
                                        error={form.errors.bcc}
                                        disabled={form.processing}
                                        hint="Use + E-mail para adicionar outra cópia oculta. Estes endereços não aparecem para os outros destinatários."
                                        onChange={(value) => form.setData('bcc', value)}
                                    />
                                </FormGrid>
                                <TextInputField
                                    id="email-compose-subject"
                                    name="subject"
                                    label="Assunto"
                                    required
                                    maxLength={255}
                                    value={form.data.subject}
                                    error={form.errors.subject}
                                    onChange={(value) => form.setData('subject', value)}
                                />
                                <RichTextField
                                    id="email-compose-body"
                                    label="Mensagem"
                                    required
                                    defaultValue={composer.body}
                                    height={350}
                                    toolbar={toolbar}
                                    error={form.errors.body}
                                    disabled={form.processing}
                                    onLoadError={editorFailed}
                                    onChange={(value) => form.setData('body', value)}
                                />
                            </FormStack>
                        </FormSection>
                        <FormSection
                            title="Anexos"
                            iconClass="fa fa-paperclip"
                            variant="inline"
                            tourTarget={EMAIL_TOUR_TARGETS.attachments}
                        >
                            {existing.length > 0 ? (
                                <ul className="emailInbox__attachmentList">
                                    {existing.map((file) => (
                                        <li key={file.index}>
                                            <a href={file.url}>{file.name}</a>
                                            <Button
                                                tone="link"
                                                size="xs"
                                                iconOnly
                                                leftIconClass="fa fa-times"
                                                title="Remover anexo"
                                                aria-label={`Remover ${file.name}`}
                                                onClick={() =>
                                                    form.setData('removed_attachments', [
                                                        ...form.data.removed_attachments,
                                                        file.index,
                                                    ])
                                                }
                                            />
                                        </li>
                                    ))}
                                </ul>
                            ) : null}
                            <EvidenceUpload
                                id="email-compose-attachments"
                                name="attachments"
                                label="Anexar arquivos"
                                files={form.data.attachments}
                                onChange={(files) => form.setData('attachments', files)}
                                maxFiles={5}
                                maxFileSizeMb={5}
                                maxFilesMessage="Anexe no máximo cinco arquivos."
                                disabled={form.processing}
                                error={attachmentError}
                                accept=".pdf,.txt,.csv,.png,.jpg,.jpeg,.gif,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.odt,.ods,.zip"
                            />
                        </FormSection>
                    </fieldset>
                </CardBox>
                <FormActions
                    status={form.processing ? 'Salvando mensagem...' : undefined}
                    tourTarget={EMAIL_TOUR_TARGETS.composeActions}
                    secondary={
                        <Button
                            tone="white"
                            label="Salvar rascunho"
                            title="Salvar rascunho"
                            leftIconClass="fa fa-floppy-o"
                            disabled={form.processing}
                            onClick={() => save('draft')}
                        />
                    }
                >
                    <Button
                        tone="cancel"
                        label="Cancelar"
                        title="Cancelar escrita"
                        disabled={form.processing}
                        onClick={() => setDiscarding(true)}
                    />
                    <Button
                        type="submit"
                        tone="save"
                        label="Enviar"
                        title="Enviar e-mail"
                        leftIconClass="fa fa-paper-plane"
                        disabled={form.processing || editorUnavailable}
                    />
                </FormActions>
            </FormLayout>
            <ConfirmActionModal
                open={discarding}
                title="Sair da escrita"
                message="Sair sem salvar as alterações desta mensagem?"
                details="Se houver um rascunho salvo, ele será preservado."
                confirmLabel="Sair sem salvar"
                onClose={() => setDiscarding(false)}
                onConfirm={() => router.visit(emailUrls.index)}
            />
        </>
    );
}
