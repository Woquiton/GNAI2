import {
    DateInputField,
    RichTextField,
    SelectInputField,
    TextInputField,
} from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import { cpfMask, phoneMask } from '@/utils/masks';
import { genderOptions } from '../Profile.constants';
import type { ProfileEditProps } from '../Profile.types';
import { PROFILE_TOUR_TARGETS } from '../profileTours';
import ProfileIdentity from './ProfileIdentity';
import type { ProfileFormState } from './useProfileForm';

type ProfilePersonalFieldsProps = Pick<ProfileFormState, 'form' | 'errors' | 'photo'> &
    Pick<ProfileEditProps, 'person' | 'professional'> & {
        onEditorFailure: () => void;
    };

/** Foto e dados pessoais de quem tem vínculo com a equipe. */
export default function ProfilePersonalFields({
    form,
    errors,
    photo,
    person,
    professional,
    onEditorFailure,
}: ProfilePersonalFieldsProps): React.JSX.Element {
    const position = professional ? (professional.position?.name ?? '---') : 'Professor(a)';
    const bond = professional ? 'Profissional Apoio' : 'Corpo Docente';

    return (
        <FormSection
            id="profile-personal"
            title="Dados Pessoais"
            variant="inline"
            iconClass="fa fa-user"
        >
            <div className="profileForm__personal">
                <ProfileIdentity
                    id="profile-photo"
                    currentPhoto={person.photo ? person.photo_url : undefined}
                    photo={photo}
                    name={person.name}
                    position={position}
                    bond={bond}
                />
                <div className="profileForm__fields" data-tour={PROFILE_TOUR_TARGETS.personal}>
                    <FormGrid columns={2}>
                        <TextInputField
                            id="profile-name"
                            name="name"
                            label="Nome Completo"
                            required
                            maxLength={255}
                            autoComplete="name"
                            value={form.data.name}
                            error={errors.name}
                            onChange={(value) => form.setData('name', value)}
                        />
                        <TextInputField
                            id="profile-email"
                            name="email"
                            type="email"
                            label="E-mail"
                            required
                            maxLength={255}
                            autoComplete="email"
                            value={form.data.email}
                            error={errors.email}
                            onChange={(value) => form.setData('email', value)}
                        />
                    </FormGrid>
                    <FormGrid columns={4}>
                        <TextInputField
                            id="profile-document"
                            name="document"
                            label="CPF"
                            maxLength={14}
                            placeholder="000.000.000-00"
                            inputMode="numeric"
                            autoComplete="off"
                            value={form.data.document}
                            error={errors.document}
                            onChange={(value) => form.setData('document', cpfMask(value))}
                        />
                        <DateInputField
                            id="profile-birth-date"
                            name="birth_date"
                            label="Data de Nascimento"
                            required
                            disabled={form.processing}
                            value={form.data.birth_date}
                            error={errors.birth_date}
                            onChange={(value) => form.setData('birth_date', value)}
                        />
                        <SelectInputField
                            id="profile-gender"
                            name="gender"
                            label="Gênero"
                            required
                            disabled={form.processing}
                            options={genderOptions}
                            value={form.data.gender}
                            error={errors.gender}
                            onChange={(value) => form.setData('gender', value)}
                        />
                        <TextInputField
                            id="profile-phone"
                            name="phone"
                            type="tel"
                            label="Telefone"
                            maxLength={15}
                            placeholder="(00) 00000-0000"
                            inputMode="numeric"
                            autoComplete="tel"
                            value={form.data.phone}
                            error={errors.phone}
                            onChange={(value) => form.setData('phone', phoneMask(value))}
                        />
                    </FormGrid>
                    <FormGrid columns={2}>
                        <TextInputField
                            id="profile-registration"
                            name="registration"
                            label="Matrícula"
                            required
                            maxLength={50}
                            autoComplete="off"
                            value={form.data.registration}
                            error={errors.registration}
                            onChange={(value) => form.setData('registration', value)}
                        />
                        <FormGridWide>
                            <RichTextField
                                id="profile-address"
                                label="Endereço"
                                defaultValue={form.data.address}
                                height={100}
                                disabled={form.processing}
                                error={errors.address}
                                onLoadError={onEditorFailure}
                                onChange={(html) => form.setData('address', html)}
                            />
                        </FormGridWide>
                    </FormGrid>
                </div>
            </div>
        </FormSection>
    );
}
