import { optionsFromRecord } from '@/components/Forms/FormFields/fieldOptions';
import {
    DateInputField,
    SelectInputField,
    TextInputField,
} from '@/components/Forms/FormFields/FormFields';
import FormGrid from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import { STUDENT_TOUR_TARGETS } from '../studentTours';
import type { StudentFormSectionProps } from './StudentForm.types';

interface StudentAcademicFieldsProps extends StudentFormSectionProps {
    studentStatuses: Record<string, string>;
    followUpTypes: Record<string, string>;
}

/** Dados acadêmicos, tipo de acompanhamento e situação do aluno. */
export default function StudentAcademicFields({
    form,
    errors,
    disabled,
    studentStatuses,
    followUpTypes,
}: StudentAcademicFieldsProps): React.JSX.Element {
    const followUpRequired = form.data.status === 'active';

    return (
        <FormSection
            id="student-academic"
            title="Dados Acadêmicos"
            variant="inline"
            iconClass="fa fa-graduation-cap"
            tourTarget={STUDENT_TOUR_TARGETS.academic}
        >
            <FormGrid columns={3}>
                <TextInputField
                    id="student-registration"
                    name="registration"
                    label="Matrícula"
                    required
                    maxLength={50}
                    value={form.data.registration}
                    error={errors.registration}
                    onChange={(value) => form.setData('registration', value)}
                />
                <DateInputField
                    id="student-entry_date"
                    name="entry_date"
                    label="Data de Ingresso"
                    disabled={disabled}
                    value={form.data.entry_date}
                    error={errors.entry_date}
                    onChange={(value) => form.setData('entry_date', value)}
                />
                <SelectInputField
                    id="student-status"
                    name="status"
                    label="Situação do aluno"
                    required
                    disabled={disabled}
                    options={optionsFromRecord(studentStatuses)}
                    value={form.data.status ?? ''}
                    error={errors.status}
                    onChange={(value) => form.setData('status', value)}
                />
                <SelectInputField
                    id="student-follow_up_type"
                    name="follow_up_type"
                    label="Tipo de acompanhamento"
                    required={followUpRequired}
                    disabled={disabled}
                    placeholder={followUpRequired ? 'Selecione' : 'Não informado'}
                    options={optionsFromRecord(followUpTypes)}
                    value={form.data.follow_up_type}
                    error={errors.follow_up_type}
                    onChange={(value) => form.setData('follow_up_type', value)}
                />
            </FormGrid>
        </FormSection>
    );
}
