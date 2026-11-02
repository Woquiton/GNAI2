import { optionsFromRecord } from '@/components/Forms/FormFields/fieldOptions';
import {
    DateInputField,
    SelectInputField,
    TextInputField,
} from '@/components/Forms/FormFields/FormFields';
import FormGrid from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import type { StudentFormMode, StudentFormSectionProps } from './StudentForm.types';

interface StudentAcademicFieldsProps extends StudentFormSectionProps {
    mode: StudentFormMode;
    studentStatuses: Record<string, string>;
}

/** Matrícula, data de ingresso e, somente na edição, o status do aluno. */
export default function StudentAcademicFields({
    form,
    errors,
    disabled,
    mode,
    studentStatuses,
}: StudentAcademicFieldsProps): React.JSX.Element {
    return (
        <FormSection
            id="student-academic"
            title="Dados Acadêmicos"
            variant="inline"
            iconClass="fa fa-graduation-cap"
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
                {mode === 'edit' ? (
                    <SelectInputField
                        id="student-status"
                        name="status"
                        label="Status do Aluno"
                        required
                        disabled={disabled}
                        options={optionsFromRecord(studentStatuses)}
                        value={form.data.status ?? ''}
                        error={errors.status}
                        onChange={(value) => form.setData('status', value)}
                    />
                ) : null}
            </FormGrid>
        </FormSection>
    );
}
