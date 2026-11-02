import { TextInputField } from '@/components/Forms/FormFields/FormFields';
import FormGrid from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import type { AccountProfile } from '../Profile.types';
import ProfileIdentity from './ProfileIdentity';
import type { AccountProfileFormState } from './useAccountProfileForm';

type AccountDataFieldsProps = Pick<AccountProfileFormState, 'form' | 'errors' | 'photo'> & {
    account: AccountProfile;
};

function accountRole(account: AccountProfile): string {
    if (account.is_super_admin) {
        return 'Administrador superior';
    }

    return account.is_admin ? 'Administrador' : 'Conta de acesso';
}

/** Foto, nome e e-mail de acesso da conta. */
export default function AccountDataFields({
    form,
    errors,
    photo,
    account,
}: AccountDataFieldsProps): React.JSX.Element {
    return (
        <FormSection
            id="account-data"
            title="Dados da Conta"
            variant="inline"
            iconClass="fa fa-user"
        >
            <div className="profileForm__personal">
                <ProfileIdentity
                    id="account-photo"
                    currentPhoto={account.photo ? account.photo_url : undefined}
                    photo={{
                        ...photo,
                        acceptedTypes: ['image/jpeg', 'image/png'],
                        maxSizeBytes: 2 * 1024 * 1024,
                    }}
                    name={account.name}
                    position={accountRole(account)}
                    bond="Conta administrativa do Gnai"
                />
                <div className="profileForm__fields">
                    <FormGrid columns={2}>
                        <TextInputField
                            id="account-name"
                            name="name"
                            label="Nome"
                            required
                            maxLength={255}
                            autoComplete="name"
                            value={form.data.name}
                            error={errors.name}
                            onChange={(value) => form.setData('name', value)}
                        />
                        <TextInputField
                            id="account-email"
                            name="email"
                            type="email"
                            label="E-mail de acesso"
                            required
                            maxLength={255}
                            autoComplete="email"
                            hint="Usado para entrar no Gnai. Para alterá-lo, informe a senha atual."
                            value={form.data.email}
                            error={errors.email}
                            onChange={(value) => form.setData('email', value)}
                        />
                    </FormGrid>
                </div>
            </div>
        </FormSection>
    );
}
