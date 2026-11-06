import { useForm } from '@inertiajs/react';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import { emailUrls } from './Emails.routes';

export function useInboxSync() {
    const form = useForm({ scope: 'replies' as 'replies' | 'folders' });
    const { submit } = useFormSubmission(form);

    function sync(scope: 'replies' | 'folders' = 'replies'): void {
        form.setData('scope', scope);
        submit({
            url: emailUrls.sync,
            failureText: 'Não foi possível consultar o Gmail. Tente novamente.',
            transform: () => ({ scope }),
            options: { preserveState: true, preserveScroll: true },
        });
    }

    return { processing: form.processing, scope: form.data.scope, sync };
}
