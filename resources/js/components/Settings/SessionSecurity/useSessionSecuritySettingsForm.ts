import { useForm } from '@inertiajs/react';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import { settingsUrls } from '../Settings.routes';
import type { SessionSecuritySettingsProps } from '../Settings.types';

export function useSessionSecuritySettingsForm({
    sessionSecuritySettings,
    canUpdate,
}: SessionSecuritySettingsProps) {
    const form = useForm({
        lock_after: String(sessionSecuritySettings.lock_after),
        logout_after: String(sessionSecuritySettings.logout_after),
    });
    const { formRef, submit } = useFormSubmission(form);

    function save(): void {
        submit({
            url: settingsUrls.sessionSecurity,
            method: 'put',
            blocked: !canUpdate,
            failureText: 'Não foi possível salvar as configurações de segurança e sessões.',
        });
    }

    return { form, formRef, save };
}
