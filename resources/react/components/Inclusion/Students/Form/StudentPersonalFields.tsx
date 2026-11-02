import { optionsFromRecord } from '@/components/Forms/FormFields/fieldOptions';
import {
    DateInputField,
    RichTextField,
    SelectInputField,
    TextInputField,
} from '@/components/Forms/FormFields/FormFields';
import FormGrid from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import PersonPhotoUpload from '@/components/Forms/PersonPhotoUpload/PersonPhotoUpload';
import PersonPhotoFields from '@/components/Inclusion/People/PersonPhotoFields';
import { cpfMask, phoneMask } from '@/utils/masks';
import type { Person } from '../Students.types';
import type { StudentFormSectionProps } from './StudentForm.types';

interface StudentPersonalFieldsProps extends StudentFormSectionProps {
    person?: Person;
    genders: Record<string, string>;
    onPhotoChange: (photo: File) => void;
    onPhotoRemove: () => void;
    onPhotoValidatingChange: (validating: boolean) => void;
    onEditorFailure: () => void;
}

/** Foto, nome, e-mail, CPF, nascimento, gênero, telefone e endereço (editor rico). */
export default function StudentPersonalFields({
    form,
    errors,
    disabled,
    person,
    genders,
    onPhotoChange,
    onPhotoRemove,
    onPhotoValidatingChange,
    onEditorFailure,
}: StudentPersonalFieldsProps): React.JSX.Element {
    const photo = (
        <PersonPhotoUpload
            id="student-photo"
            name="photo"
            label="Foto do Aluno"
            current={person?.photo ? person.photo_url : undefined}
            file={form.data.photo}
            removed={form.data.remove_photo ?? false}
            error={errors.photo ?? errors.remove_photo}
            disabled={disabled}
            onChange={onPhotoChange}
            onRemove={onPhotoRemove}
            onValidatingChange={onPhotoValidatingChange}
            onError={(message) => form.setError('photo', message)}
        />
    );

    return (
        <FormSection
            id="student-personal"
            title="Dados Pessoais"
            variant="inline"
            iconClass="fa fa-user"
        >
            <PersonPhotoFields className="studentForm__personal" photo={photo}>
                <FormGrid>
                    <TextInputField
                        id="student-name"
                        name="name"
                        label="Nome Completo"
                        required
                        minLength={3}
                        maxLength={255}
                        value={form.data.name}
                        error={errors.name}
                        onChange={(value) => form.setData('name', value)}
                    />
                    <TextInputField
                        id="student-email"
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
                        id="student-document"
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
                        id="student-birth_date"
                        name="birth_date"
                        label="Data de Nascimento"
                        required
                        disabled={disabled}
                        value={form.data.birth_date}
                        error={errors.birth_date}
                        onChange={(value) => form.setData('birth_date', value)}
                    />
                    <SelectInputField
                        id="student-gender"
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
                        id="student-phone"
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
            </PersonPhotoFields>
            <RichTextField
                id="student-address"
                label="Endereço"
                defaultValue={person?.address_html ?? ''}
                height={90}
                disabled={disabled}
                error={errors.address}
                onLoadError={onEditorFailure}
                onChange={(html) => form.setData('address', html)}
            />
        </FormSection>
    );
}
