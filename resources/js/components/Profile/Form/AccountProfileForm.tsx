import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import CardBox from '@/components/UI/CardBox/CardBox';
import type { ProfileAccountProps } from '../Profile.types';
import AccountDataFields from './AccountDataFields';
import AccountSecurityFields from './AccountSecurityFields';
import ProfileFormActions from './ProfileFormActions';
import { useAccountProfileForm } from './useAccountProfileForm';

/** Perfil das contas administrativas: foto, dados de acesso e segurança. */
export default function AccountProfileForm({ account }: ProfileAccountProps): React.JSX.Element {
    const { form, errors, formRef, photoValidating, photo, save } = useAccountProfileForm(account);

    return (
        <FormLayout
            ref={formRef}
            className="profileForm"
            aria-label="Editar meu perfil"
            aria-busy={form.processing}
            encType="multipart/form-data"
            onSubmit={(event) => {
                event.preventDefault();
                save();
            }}
        >
            <CardBox>
                <fieldset disabled={form.processing}>
                    <AccountDataFields
                        form={form}
                        errors={errors}
                        photo={photo}
                        account={account}
                    />
                    <AccountSecurityFields form={form} errors={errors} />
                </fieldset>
            </CardBox>
            <ProfileFormActions
                processing={form.processing}
                photoValidating={photoValidating}
                uploadPercentage={form.progress?.percentage}
            />
        </FormLayout>
    );
}
