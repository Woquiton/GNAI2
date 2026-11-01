import {
    DateInputField,
    RichTextField,
    SelectInputField,
    TextInputField,
} from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import PersonPhotoUpload from '@/components/Forms/PersonPhotoUpload/PersonPhotoUpload';
import { cpfMask, phoneMask } from '@/utils/masks';
import { teacherGenderOptions } from '../Teachers.constants';
import type { TeacherPerson } from '../Teachers.types';
import type { TeacherFormMode, TeacherFormSectionProps } from './TeacherForm.types';

interface TeacherPersonFieldsProps extends TeacherFormSectionProps {
    mode: TeacherFormMode;
    person?: TeacherPerson;
    onPhotoValidatingChange: (validating: boolean) => void;
    onEditorFailure: () => void;
}

/** Foto, nome, e-mail, CPF, nascimento, gênero, telefone e endereço do professor. */
export default function TeacherPersonFields({
    form,
    errors,
    disabled,
    mode,
    person,
    onPhotoValidatingChange,
    onEditorFailure,
}: TeacherPersonFieldsProps): React.JSX.Element {
    const editing = mode === 'edit';

    return (
        <FormSection
            id="teacher-personal"
            title="Dados Pessoais"
            variant="inline"
            iconClass="fa fa-user"
        >
            <div className="teacherForm__personal">
                <PersonPhotoUpload
                    id="teacher-photo"
                    name="photo"
                    label="Foto do Professor"
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
                        form.setData((data) => ({ ...data, photo: null, remove_photo: editing }));
                        form.clearErrors('photo');
                    }}
                    onValidatingChange={onPhotoValidatingChange}
                    onError={(message) => form.setError('photo', message)}
                />
                <div className="teacherForm__personalFields">
                    <FormGrid>
                        <TextInputField
                            id="teacher-name"
                            name="name"
                            label="Nome Completo"
                            required
                            maxLength={255}
                            value={form.data.name}
                            error={errors.name}
                            onChange={(value) => form.setData('name', value)}
                        />
                        <TextInputField
                            id="teacher-email"
                            name="email"
                            type="email"
                            label={editing ? 'E-mail' : 'E-mail de Acesso'}
                            required
                            value={form.data.email}
                            error={errors.email}
                            onChange={(value) => form.setData('email', value)}
                        />
                    </FormGrid>
                    <FormGrid columns={4}>
                        <TextInputField
                            id="teacher-document"
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
                            id="teacher-birth_date"
                            name="birth_date"
                            label="Data de Nascimento"
                            required
                            disabled={disabled}
                            value={form.data.birth_date}
                            error={errors.birth_date}
                            onChange={(value) => form.setData('birth_date', value)}
                        />
                        <SelectInputField
                            id="teacher-gender"
                            name="gender"
                            label="Gênero"
                            required
                            disabled={disabled}
                            options={teacherGenderOptions}
                            value={form.data.gender}
                            error={errors.gender}
                            onChange={(value) => form.setData('gender', value)}
                        />
                        <TextInputField
                            id="teacher-phone"
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
                    <RichTextField
                        id="teacher-address"
                        label={editing ? 'Endereço' : 'Endereço Residencial'}
                        defaultValue={form.data.address}
                        height={100}
                        disabled={disabled}
                        error={errors.address}
                        onLoadError={onEditorFailure}
                        onChange={(html) => form.setData('address', html)}
                    />
                </FormGridWide>
            </FormGrid>
        </FormSection>
    );
}
