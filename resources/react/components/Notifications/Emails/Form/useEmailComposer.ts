import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import { notifyOperationFailure } from '@/components/UI/NotificationToast/operationFeedback';
import type { EmailComposeProps } from '../Emails.types';
import { emailUrls } from '../Emails.routes';

export function useEmailComposer(composer: EmailComposeProps['composer']) {
    const form = useForm({
        key: composer.key,
        intent: 'send',
        to: composer.to,
        cc: composer.cc,
        bcc: composer.bcc,
        subject: composer.subject,
        body: composer.body,
        attachments: [] as File[],
        removed_attachments: [] as number[],
        source_id: composer.source_id,
        reply_mode: composer.reply_mode,
    });
    const submission = useFormSubmission(form);
    const [editorUnavailable, setEditorUnavailable] = useState(false);
    const attachmentError =
        form.errors.attachments ??
        Object.entries(form.errors).find(([key]) => key.startsWith('attachments.'))?.[1];

    function save(intent: 'send' | 'draft'): void {
        submission.submit({
            url: emailUrls.store,
            files: true,
            blocked: intent === 'send' && editorUnavailable,
            failureText: 'Não foi possível salvar a mensagem. Seu texto permanece no formulário.',
            transform: (data) => ({ ...data, intent }),
            options: {
                onSuccess: () => {
                    const saved = { ...form.data, attachments: [], removed_attachments: [] };
                    form.setDefaults(saved);
                    form.setData(saved);
                },
            },
        });
    }

    function editorFailed(): void {
        setEditorUnavailable(true);
        notifyOperationFailure(
            'O editor de e-mail não carregou. Salve o rascunho e atualize a página para tentar novamente.',
        );
    }

    return {
        form,
        formRef: submission.formRef,
        attachmentError,
        editorUnavailable,
        editorFailed,
        save,
    };
}
