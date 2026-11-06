import { SelectInputField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import FormGrid from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import { attendanceFormatOptions, attendanceLocationOptions } from '../Paees.constants';
import { PAEE_TOUR_TARGETS } from '../paeeTours';
import type { PaeeFormSectionProps } from './PaeeForm.types';
import { paeeFieldId } from './usePaeeForm';

/** Frequência, duração, formato e local do atendimento. */
export default function PaeeAttendanceFields({
    form,
    errors,
    disabled,
}: PaeeFormSectionProps): React.JSX.Element {
    return (
        <FormSection
            id="paee-attendance"
            tourTarget={PAEE_TOUR_TARGETS.attendance}
            title="Caracterização do Atendimento"
            variant="inline"
            iconClass="fa fa-calendar-check-o"
        >
            <FormGrid columns={4}>
                <TextInputField
                    id={paeeFieldId('attendance_frequency_per_week')}
                    name="attendance_frequency_per_week"
                    type="number"
                    label="Frequência semanal"
                    min={1}
                    max={7}
                    required
                    value={form.data.attendance_frequency_per_week}
                    error={errors.attendance_frequency_per_week}
                    onChange={(value) => form.setData('attendance_frequency_per_week', value)}
                />
                <TextInputField
                    id={paeeFieldId('attendance_duration_minutes')}
                    name="attendance_duration_minutes"
                    type="number"
                    label="Duração (minutos)"
                    min={1}
                    required
                    value={form.data.attendance_duration_minutes}
                    error={errors.attendance_duration_minutes}
                    onChange={(value) => form.setData('attendance_duration_minutes', value)}
                />
                <SelectInputField
                    id={paeeFieldId('attendance_format')}
                    name="attendance_format"
                    label="Formato do atendimento"
                    required
                    options={attendanceFormatOptions}
                    disabled={disabled}
                    value={form.data.attendance_format}
                    error={errors.attendance_format}
                    onChange={(value) => form.setData('attendance_format', value)}
                />
                <SelectInputField
                    id={paeeFieldId('attendance_location')}
                    name="attendance_location"
                    label="Local do atendimento"
                    required
                    options={attendanceLocationOptions}
                    disabled={disabled}
                    value={form.data.attendance_location}
                    error={errors.attendance_location}
                    onChange={(value) => form.setData('attendance_location', value)}
                />
            </FormGrid>
        </FormSection>
    );
}
