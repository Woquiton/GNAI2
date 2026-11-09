import type { ReactNode } from 'react';
import FormSection from '@/components/Forms/FormSection/FormSection';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import {
    TextInputField,
    DateInputField,
    SelectInputField,
    RichTextField,
} from '@/components/Forms/FormFields/FormFields';
import { optionsFromRecord } from '@/components/Forms/FormFields/fieldOptions';
import PersonPhotoUpload from '@/components/Forms/PersonPhotoUpload/PersonPhotoUpload';
import { cpfMask, phoneMask } from '@/utils/masks';
import PersonPhotoFields from '../PersonPhotoFields';
import type { PersonFormProps } from '../People.types';
import type { PersonFormState } from './usePersonForm';

export default function PersonIdentityFields({
    state,
    options,
    tags,
}: {
    state: PersonFormState;
    options: PersonFormProps;
    tags: ReactNode;
}): React.JSX.Element {
    const { form, setEditorFailed, setPhotoValidating } = state;
    return (
        <FormSection variant="inline" title="Dados pessoais" iconClass="fa fa-user">
            <div data-tour="person-identity">
                <PersonPhotoFields
                    photo={
                        <PersonPhotoUpload
                            id="person-photo"
                            current={options.person?.photo_url}
                            file={form.data.photo}
                            removed={form.data.remove_photo}
                            disabled={form.processing}
                            error={form.errors.photo ?? form.errors.remove_photo}
                            onChange={(photo) =>
                                form.setData((data) => ({ ...data, photo, remove_photo: false }))
                            }
                            onRemove={() =>
                                form.setData((data) => ({
                                    ...data,
                                    photo: null,
                                    remove_photo: true,
                                }))
                            }
                            onError={(message) => form.setError('photo', message)}
                            onValidatingChange={setPhotoValidating}
                        />
                    }
                >
                    <FormGrid>
                        <FormGridWide>
                            <TextInputField
                                id="person-name"
                                name="name"
                                label="Nome completo"
                                required
                                value={form.data.name}
                                error={form.errors.name}
                                onChange={(value) => form.setData('name', value)}
                            />
                        </FormGridWide>
                        <TextInputField
                            id="person-document"
                            name="document"
                            label="CPF"
                            maxLength={14}
                            inputMode="numeric"
                            value={form.data.document}
                            error={form.errors.document}
                            onChange={(value) => form.setData('document', cpfMask(value))}
                        />
                        <DateInputField
                            disabled={form.processing}
                            id="person-birth-date"
                            name="birth_date"
                            label="Data de nascimento"
                            required
                            value={form.data.birth_date}
                            error={form.errors.birth_date}
                            onChange={(value) => form.setData('birth_date', value)}
                        />
                        <SelectInputField
                            disabled={form.processing}
                            id="person-gender"
                            name="gender"
                            label="Gênero"
                            required
                            value={form.data.gender}
                            options={optionsFromRecord(options.genders)}
                            error={form.errors.gender}
                            onChange={(value) => form.setData('gender', value)}
                        />
                        <TextInputField
                            id="person-email"
                            name="email"
                            label="E-mail"
                            type="email"
                            required={form.data.roles.some((role) => role !== 'guardian')}
                            value={form.data.email}
                            error={form.errors.email}
                            onChange={(value) => form.setData('email', value)}
                        />
                        <TextInputField
                            id="person-phone"
                            name="phone"
                            label="Telefone"
                            maxLength={15}
                            type="tel"
                            required={form.data.roles.includes('guardian')}
                            value={form.data.phone}
                            error={form.errors.phone}
                            onChange={(value) => form.setData('phone', phoneMask(value))}
                        />
                        {tags}
                    </FormGrid>
                </PersonPhotoFields>
                <RichTextField
                    id="person-address"
                    label="Endereço"
                    defaultValue={form.data.address}
                    disabled={form.processing}
                    error={form.errors.address}
                    onChange={(value) => form.setData('address', value)}
                    onLoadError={() => {
                        setEditorFailed(true);
                        form.setError(
                            'address',
                            'Não foi possível carregar o editor. Atualize a página.',
                        );
                    }}
                />
            </div>
        </FormSection>
    );
}
