import { useForm } from '@inertiajs/react';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import { settingsUrls } from '../Settings.routes';
import type { TeacherAccessSettingsProps } from '../Settings.types';

/** Estado e envio da lista de domínios aceitos no acesso por link. */
export function useTeacherAccessSettingsForm({ domains, canUpdate }: TeacherAccessSettingsProps) {
    const form = useForm({ domains: domains.map((domain) => ({ domain })) });
    const { formRef, submit } = useFormSubmission(form);
    const errors = form.errors as Record<string, string | undefined>;
    const disabled = !canUpdate || form.processing;

    function save(): void {
        submit({
            url: settingsUrls.teacherAccess,
            method: 'put',
            blocked: !canUpdate,
            failureText: 'Não foi possível salvar o acesso dos professores. Tente novamente.',
            transform: (data) => ({
                domains: (data.domains as { domain: string }[]).map((item) => item.domain),
            }),
        });
    }

    return { form, formRef, errors, disabled, save };
}
