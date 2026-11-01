import { optionsFromRecord } from '@/components/Forms/FormFields/fieldOptions';
import {
    DateInputField,
    SelectInputField,
    TextAreaField,
    TextInputField,
} from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import PersonPhotoUpload from '@/components/Forms/PersonPhotoUpload/PersonPhotoUpload';
import { cpfMask, phoneMask } from '@/utils/masks';
import type { ProfessionalPerson } from '../Professionals.types';
import type { ProfessionalFormMode, ProfessionalFormSectionProps } from './ProfessionalForm.types';

interface ProfessionalPersonFieldsProps extends ProfessionalFormSectionProps {
    mode: ProfessionalFormMode;
    person?: ProfessionalPerson;
    genders: Record<string, string>;
    onPhotoValidatingChange: (validating: boolean) => void;
}

/** Foto, nome, e-mail, CPF, nascimento, gênero, telefone e endereço. */
export default function ProfessionalPersonFields({
    form,
    errors,
    disabled,
    mode,
    person,
    genders,
    onPhotoValidatingChange,
}: ProfessionalPersonFieldsProps): React.JSX.Element {
    return (
        <FormSection
            id="professional-person"
            title="Dados da Pessoa"
            variant="inline"
            iconClass="fa fa-user"
        >
            <div className="professionalForm__personal">
                <PersonPhotoUpload
                    id="professional-photo"
                    name="photo"
                    label="Foto do Profissional"
                    current={person?.photo ? person.photo_url : undefined}
                    file={form.data.photo}
                    removed={form.data.remove_photo}
                    error={errors.photo ?? errors.remove_photo}
                    disabled={disabled}
                    acceptedTypes={['image/jpeg', 'image/png']}
                    maxSizeBytes={2 * 1024 * 1024}
                    onChange={(photo) => {
                        form.setData((data) => ({ ...data, photo, remove_photo: false }));
                        form.clearErrors('photo', 'remove_photo');
                    }}
                    onRemove={() => {
                        // Na edição, remover significa também apagar a foto já salva.
                        form.setData((data) => ({
                            ...data,
                            photo: null,
                            remove_photo: mode === 'edit',
                        }));
                        form.clearErrors('photo');
                    }}
                    onValidatingChange={onPhotoValidatingChange}
                    onError={(message) => form.setError('photo', message)}
                />
                <div className="professionalForm__personalFields">
                    <FormGrid>
                        <TextInputField
                            id="professional-name"
                            name="name"
                            label="Nome"
                            required
                            maxLength={255}
                            value={form.data.name}
                            error={errors.name}
                            onChange={(value) => form.setData('name', value)}
                        />
                        <TextInputField
                            id="professional-email"
                            name="email"
                            type="email"
                            label="E-mail"
                            required
                            maxLength={255}
                            value={form.data.email}
                            error={errors.email}
                            onChange={(value) => form.setData('email', value)}
                        />
                    </FormGrid>
                    <FormGrid columns={4}>
                        <TextInputField
                            id="professional-document"
                            name="document"
                            label="CPF"
                            maxLength={14}
                            inputMode="numeric"
                            placeholder="000.000.000-00"
                            value={form.data.document}
                            error={errors.document}
                            onChange={(value) => form.setData('document', cpfMask(value))}
                        />
                        <DateInputField
                            id="professional-birth_date"
                            name="birth_date"
                            label="Nascimento"
                            required
                            disabled={disabled}
                            value={form.data.birth_date}
                            error={errors.birth_date}
                            onChange={(value) => form.setData('birth_date', value)}
                        />
                        <SelectInputField
                            id="professional-gender"
                            name="gender"
                            label="Gênero"
                            required
                            disabled={disabled}
                            options={optionsFromRecord(genders)}
                            value={form.data.gender}
                            error={errors.gender}
                            onChange={(value) => form.setData('gender', value)}
                        />
                        <TextInputField
                            id="professional-phone"
                            name="phone"
                            type="tel"
                            label="Telefone"
                            maxLength={15}
                            inputMode="numeric"
                            placeholder="(00) 00000-0000"
                            value={form.data.phone}
                            error={errors.phone}
                            onChange={(value) => form.setData('phone', phoneMask(value))}
                        />
                    </FormGrid>
                </div>
            </div>
            <FormGrid>
                <FormGridWide>
                    <TextAreaField
                        id="professional-address"
                        name="address"
                        label="Endereço"
                        rows={2}
                        maxLength={500}
                        value={form.data.address}
                        error={errors.address}
                        onChange={(value) => form.setData('address', value)}
                    />
                </FormGridWide>
            </FormGrid>
        </FormSection>
    );
}
