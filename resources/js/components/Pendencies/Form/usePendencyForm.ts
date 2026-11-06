import { useForm } from '@inertiajs/react';
import { useEditorFailure } from '@/components/Forms/FormLayout/useEditorFailure';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import { pendencyUrls } from '../Pendencies.routes';
import type { PendencyRecord } from '../Pendencies.types';
import type { PendencyFormData } from './PendencyForm.types';

interface UsePendencyFormOptions {
    pendency?: PendencyRecord;
    /** Vencimento já convertido para `AAAA-MM-DD` pelo controller (`pendencyForm.due_date`). */
    dueDate?: string;
}

/** Estado e envio do cadastro/edição de pendências. */
export function usePendencyForm({ pendency, dueDate = '' }: UsePendencyFormOptions) {
    const form = useForm<PendencyFormData>({
        title: pendency?.title ?? '',
        description: pendency?.description ?? '',
        assigned_to: pendency?.assigned_to ? String(pendency.assigned_to) : '',
        priority: pendency?.priority ?? '',
        due_date: dueDate,
    });
    const { formRef, submit } = useFormSubmission(form);
    const { editorFailed, reportEditorFailure } = useEditorFailure(form);

    function save(): void {
        submit({
            url: pendency ? pendencyUrls.update(pendency.id) : pendencyUrls.store,
            method: pendency ? 'put' : 'post',
            blocked: editorFailed,
            failureText:
                'Não foi possível salvar a pendência. Atualize a página e tente novamente.',
        });
    }

    return { form, errors: form.errors, formRef, save, editorFailed, reportEditorFailure };
}
