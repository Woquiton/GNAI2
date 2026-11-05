import { useForm } from '@inertiajs/react';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import { settingsUrls } from '../Settings.routes';
import type { AutomaticEmailSettingsProps } from '../Settings.types';

export function useAutomaticEmailSettingsForm({ events, canUpdate }: AutomaticEmailSettingsProps) {
    const form = useForm({ events });
    const { formRef, submit } = useFormSubmission(form);
    const errors = form.errors as Record<string, string | undefined>;
    const disabled = !canUpdate || form.processing;

    function save(): void {
        submit({
            url: settingsUrls.automaticEmails,
            method: 'put',
            blocked: !canUpdate,
            failureText: 'Não foi possível salvar os e-mails automáticos. Tente novamente.',
        });
    }

    function changeEvent(purpose: string, enabled: boolean): void {
        form.setData('events', { ...form.data.events, [purpose]: enabled });
    }

    return { form, formRef, errors, disabled, save, changeEvent };
}
