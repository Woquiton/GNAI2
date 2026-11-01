import { TextInputField } from '@/components/Forms/FormFields/FormFields';
import FormGrid from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import type { ProfileFormState } from './useProfileForm';

/** Nova senha e confirmação; em branco, a senha atual é mantida. */
export default function ProfilePasswordFields({
    form,
    errors,
}: Pick<ProfileFormState, 'form' | 'errors'>): React.JSX.Element {
    return (
        <FormSection
            id="profile-password"
            title="Alterar Senha"
            variant="inline"
            iconClass="fa fa-lock"
        >
            <FormGrid columns={2}>
                <TextInputField
                    id="profile-password"
                    name="password"
                    type="password"
                    label="Nova Senha"
                    autoComplete="new-password"
                    value={form.data.password}
                    error={errors.password}
                    onChange={(value) => form.setData('password', value)}
                />
                <TextInputField
                    id="profile-password-confirmation"
                    name="password_confirmation"
                    type="password"
                    label="Confirmar Nova Senha"
                    autoComplete="new-password"
                    value={form.data.password_confirmation}
                    error={errors.password_confirmation}
                    onChange={(value) => form.setData('password_confirmation', value)}
                />
            </FormGrid>
        </FormSection>
    );
}
