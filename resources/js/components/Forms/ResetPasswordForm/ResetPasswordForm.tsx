import { useForm } from '@inertiajs/react';
import { TextInputField } from '@/components/Forms/FormFields/FormFields';
import FieldError from '@/components/Forms/FormField/FieldError';
import { FormStack } from '@/components/Forms/FormGrid/FormGrid';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import Button from '@/components/UI/Button/Button';
import type { ResetPasswordProps } from './ResetPasswordForm.types';

export default function ResetPasswordForm({ token, email }: ResetPasswordProps): React.JSX.Element {
    const form = useForm({ token, email, password: '', password_confirmation: '' });
    const submission = useFormSubmission(form);

    function submit(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        submission.submit({
            url: '/autenticacao/redefinir-senha',
            failureText: 'Não foi possível alterar a senha. Tente novamente.',
            options: {
                onFinish: () => form.reset('password', 'password_confirmation'),
            },
        });
    }

    return (
        <FormLayout
            ref={submission.formRef}
            aria-label="Redefinir senha do Gnai"
            aria-busy={form.processing}
            onSubmit={submit}
        >
            <FormStack>
                <p>Escolha uma senha segura para proteger sua conta no Gnai.</p>
                <input type="hidden" id="reset-token" name="token" value={form.data.token} />
                <FieldError id="reset-token" error={form.errors.token} />
                <TextInputField
                    id="reset-email"
                    name="email"
                    type="email"
                    label="E-mail"
                    autoComplete="username"
                    required
                    value={form.data.email}
                    error={form.errors.email}
                    disabled={form.processing}
                    onChange={(value) => form.setData('email', value)}
                />
                <TextInputField
                    id="reset-password"
                    name="password"
                    type="password"
                    label="Nova senha"
                    autoComplete="new-password"
                    required
                    hint="Use pelo menos 8 caracteres, incluindo letras e números."
                    value={form.data.password}
                    error={form.errors.password}
                    disabled={form.processing}
                    onChange={(value) => form.setData('password', value)}
                />
                <TextInputField
                    id="reset-password-confirmation"
                    name="password_confirmation"
                    type="password"
                    label="Confirmar senha"
                    autoComplete="new-password"
                    required
                    value={form.data.password_confirmation}
                    error={form.errors.password_confirmation}
                    disabled={form.processing}
                    onChange={(value) => form.setData('password_confirmation', value)}
                />
                <Button
                    type="submit"
                    tone="save"
                    block
                    label={form.processing ? 'Alterando senha...' : 'Alterar senha'}
                    disabled={form.processing}
                />
            </FormStack>
        </FormLayout>
    );
}
