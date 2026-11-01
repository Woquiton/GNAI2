import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import CardBox from '@/components/UI/CardBox/CardBox';
import type { ProfileEditProps } from '../Profile.types';
import ProfileFormActions from './ProfileFormActions';
import ProfilePasswordFields from './ProfilePasswordFields';
import ProfilePersonalFields from './ProfilePersonalFields';
import { useProfileForm } from './useProfileForm';

/** Perfil de profissionais e professores: dados pessoais, foto e senha. */
export default function ProfileForm(props: ProfileEditProps): React.JSX.Element {
    const {
        form,
        errors,
        formRef,
        photoValidating,
        editorFailed,
        reportEditorFailure,
        photo,
        save,
    } = useProfileForm(props);

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
                    <ProfilePersonalFields
                        form={form}
                        errors={errors}
                        photo={photo}
                        person={props.person}
                        professional={props.professional}
                        onEditorFailure={() => reportEditorFailure('address', 'endereço')}
                    />
                    <ProfilePasswordFields form={form} errors={errors} />
                </fieldset>
            </CardBox>
            <ProfileFormActions
                processing={form.processing}
                photoValidating={photoValidating}
                editorFailed={editorFailed}
                uploadPercentage={form.progress?.percentage}
            />
        </FormLayout>
    );
}
