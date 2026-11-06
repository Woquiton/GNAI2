import { optionsFromRecord } from '@/components/Forms/FormFields/fieldOptions';
import {
    DateInputField,
    SelectInputField,
    TextInputField,
} from '@/components/Forms/FormFields/FormFields';
import FormGrid from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import PersonPhotoUpload from '@/components/Forms/PersonPhotoUpload/PersonPhotoUpload';
import PersonPhotoFields from '@/components/People/PersonPhotoFields';
import { cpfMask } from '@/utils/masks';
import { guardianPhotoTypes } from '../Guardians.constants';
import type { GuardianPerson } from '../Guardians.types';
import { GUARDIAN_TOUR_TARGETS } from '../guardianTours';
import type { GuardianFormSectionProps } from './GuardianForm.types';

interface GuardianPersonalFieldsProps extends GuardianFormSectionProps {
    person?: GuardianPerson;
    genders: Record<string, string>;
    onPhotoChange: (photo: File) => void;
    onPhotoRemove: () => void;
    onPhotoValidatingChange: (validating: boolean) => void;
}

/** Foto, nome, CPF, nascimento e gênero do responsável. */
export default function GuardianPersonalFields({
    form,
    errors,
    disabled,
    person,
    genders,
    onPhotoChange,
    onPhotoRemove,
    onPhotoValidatingChange,
}: GuardianPersonalFieldsProps): React.JSX.Element {
    const photo = (
        <PersonPhotoUpload
            id="guardian-photo"
            name="photo"
            label="Foto do Responsável"
            current={person?.photo ? person.photo_url : undefined}
            file={form.data.photo}
            removed={form.data.remove_photo ?? false}
            acceptedTypes={guardianPhotoTypes}
            error={errors.photo ?? errors.remove_photo}
            disabled={disabled}
            onChange={onPhotoChange}
            onRemove={onPhotoRemove}
            onValidatingChange={onPhotoValidatingChange}
            onError={(message) => form.setError('photo', message)}
            tourTarget={GUARDIAN_TOUR_TARGETS.photo}
        />
    );

    return (
        <FormSection
            id="guardian-personal"
            title="Dados Pessoais"
            variant="inline"
            iconClass="fa fa-user"
            tourTarget={GUARDIAN_TOUR_TARGETS.personal}
        >
            <PersonPhotoFields photo={photo}>
                <FormGrid columns={2}>
                    <TextInputField
                        id="guardian-name"
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
                        id="guardian-document"
                        name="document"
                        label="CPF"
                        inputMode="numeric"
                        maxLength={14}
                        placeholder="000.000.000-00"
                        value={form.data.document}
                        error={errors.document}
                        onChange={(value) => form.setData('document', cpfMask(value))}
                    />
                    <DateInputField
                        id="guardian-birth-date"
                        name="birth_date"
                        label="Data de Nascimento"
                        required
                        disabled={disabled}
                        value={form.data.birth_date}
                        error={errors.birth_date}
                        onChange={(value) => form.setData('birth_date', value)}
                    />
                    <SelectInputField
                        id="guardian-gender"
                        name="gender"
                        label="Gênero"
                        required
                        disabled={disabled}
                        options={optionsFromRecord(genders)}
                        value={form.data.gender}
                        error={errors.gender}
                        onChange={(value) => form.setData('gender', value)}
                    />
                </FormGrid>
            </PersonPhotoFields>
        </FormSection>
    );
}
