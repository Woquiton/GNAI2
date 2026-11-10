import FormGrid from '@/components/Forms/FormGrid/FormGrid';
import { TextInputField } from '@/components/Forms/FormFields/FormFields';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import FormSection from '@/components/Forms/FormSection/FormSection';
import ProfileIdentity from '@/components/Profile/Form/ProfileIdentity';
import ProfileFormActions from '@/components/Profile/Form/ProfileFormActions';
import { useProfileSubmission } from '@/components/Profile/Form/useProfileSubmission';
import { PROFILE_TOUR_TARGETS } from '@/components/Profile/profileTours';
import CardBox from '@/components/UI/CardBox/CardBox';
import { teacherPortalUrls } from '../TeacherPortal.routes';
import type { TeacherProfileProps } from '../TeacherPortal.types';

interface TeacherProfileFormData {
    name: string;
    photo: File | null;
    remove_photo: boolean;
}

export default function TeacherProfileForm({ person, email }: TeacherProfileProps): React.JSX.Element {
    const { form, errors, formRef, photo, photoValidating, save } =
        useProfileSubmission<TeacherProfileFormData>({
            url: teacherPortalUrls.profile,
            initialData: { name: person.name, photo: null, remove_photo: false },
            clearedOnSuccess: { photo: null, remove_photo: false },
        });

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
                    <FormSection
                        id="teacher-profile-personal"
                        title="Dados Pessoais"
                        variant="inline"
                        iconClass="fa fa-user"
                    >
                        <div className="profileForm__personal">
                            <ProfileIdentity
                                id="teacher-profile-photo"
                                currentPhoto={person.photo ? person.photo_url : undefined}
                                photo={photo}
                                name={person.name}
                                position="Professor(a)"
                                bond="Corpo Docente"
                            />
                            <div
                                className="profileForm__fields"
                                data-tour={PROFILE_TOUR_TARGETS.personal}
                            >
                                <FormGrid columns={2}>
                                    <TextInputField
                                        id="teacher-profile-name"
                                        name="name"
                                        label="Nome Completo"
                                        required
                                        minLength={3}
                                        maxLength={255}
                                        autoComplete="name"
                                        value={form.data.name}
                                        error={errors.name}
                                        onChange={(value) => form.setData('name', value)}
                                    />
                                    <TextInputField
                                        id="teacher-profile-email"
                                        label="E-mail de acesso"
                                        type="email"
                                        readOnly
                                        value={email}
                                        hint="Para alterar seu e-mail de acesso, procure a equipe do núcleo. O acesso ao portal é feito pelo link enviado ao seu e-mail, sem senha."
                                    />
                                </FormGrid>
                            </div>
                        </div>
                    </FormSection>
                </fieldset>
            </CardBox>
            <ProfileFormActions
                cancelHref={teacherPortalUrls.index}
                processing={form.processing}
                photoValidating={photoValidating}
                uploadPercentage={form.progress?.percentage}
            />
        </FormLayout>
    );
}
