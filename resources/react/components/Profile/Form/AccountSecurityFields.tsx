import { TextInputField } from '@/components/Forms/FormFields/FormFields';
import FormGrid from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import type { AccountProfileFormState } from './useAccountProfileForm';

/** Senha atual (exigida para trocar e-mail ou senha), nova senha e confirmação. */
export default function AccountSecurityFields({
    form,
    errors,
}: Pick<AccountProfileFormState, 'form' | 'errors'>): React.JSX.Element {
    return (
        <FormSection
            id="account-password"
            title="Segurança"
            variant="inline"
            iconClass="fa fa-lock"
        >
            <FormGrid columns={3}>
                <TextInputField
                    id="account-current-password"
                    name="current_password"
                    type="password"
                    label="Senha atual"
                    autoComplete="current-password"
                    hint="Obrigatória para alterar o e-mail ou a senha."
                    value={form.data.current_password}
                    error={errors.current_password}
                    onChange={(value) => form.setData('current_password', value)}
                />
                <TextInputField
                    id="account-password"
                    name="password"
                    type="password"
                    label="Nova senha"
                    autoComplete="new-password"
                    hint="Mínimo de 12 caracteres, com maiúsculas, minúsculas, números e símbolos. Deixe em branco para manter."
                    value={form.data.password}
                    error={errors.password}
                    onChange={(value) => form.setData('password', value)}
                />
                <TextInputField
                    id="account-password-confirmation"
                    name="password_confirmation"
                    type="password"
                    label="Confirmar nova senha"
                    autoComplete="new-password"
                    value={form.data.password_confirmation}
                    error={errors.password_confirmation}
                    onChange={(value) => form.setData('password_confirmation', value)}
                />
            </FormGrid>
        </FormSection>
    );
}
