import { optionsFromRecord } from '@/components/Forms/FormFields/fieldOptions';
import { SelectInputField } from '@/components/Forms/FormFields/FormFields';
import FormGrid from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import { INDIVIDUAL_SESSION } from '../Sessions.constants';
import type { SessionCreateProps } from '../Sessions.types';
import type { SessionFormSectionProps } from './SessionForm.types';
import { personOptions } from './SessionForm.utils';
import SessionScheduleFields from './SessionScheduleFields';
import SessionStudentRows from './SessionStudentRows';
import type { SessionFormState } from './useSessionForm';

interface SessionParticipantsFieldsProps extends SessionFormSectionProps {
    options: SessionCreateProps;
    state: SessionFormState;
}

/** Cadastro: tipo de atendimento, formato, profissional, alunos, data e horário. */
export default function SessionParticipantsFields({
    form,
    errors,
    disabled,
    options,
    state,
}: SessionParticipantsFieldsProps): React.JSX.Element {
    const { isPedagogical } = state;

    return (
        <FormSection
            id="session-participants"
            title="Participantes e Horário"
            variant="inline"
            iconClass="fa fa-users"
        >
            <FormGrid columns={2}>
                <SelectInputField
                    id="session-attendance-type"
                    name="attendance_type"
                    label="Tipo de Atendimento"
                    required
                    disabled={disabled}
                    value={form.data.attendance_type}
                    options={optionsFromRecord(options.attendanceTypes)}
                    error={errors.attendance_type}
                    onChange={state.changeAttendanceType}
                />
                <SelectInputField
                    id="session-type"
                    name="type"
                    label="Formato"
                    required
                    disabled={disabled || isPedagogical}
                    value={isPedagogical ? INDIVIDUAL_SESSION : form.data.type}
                    options={optionsFromRecord(options.sessionTypes)}
                    error={errors.type}
                    onChange={(value) => form.setData('type', value)}
                />
                <SelectInputField
                    id="session-professional"
                    name="professional_id"
                    label="Profissional"
                    required
                    disabled={disabled}
                    value={form.data.professional_id}
                    options={personOptions(options.professionals)}
                    error={errors.professional_id}
                    onChange={(value) => form.setData('professional_id', value)}
                />
                <SessionStudentRows
                    studentIds={form.data.student_ids}
                    errors={errors}
                    disabled={disabled}
                    studentOptions={personOptions(options.students)}
                    rowKeys={state.rowKeys}
                    canAdd={state.canAddStudents}
                    onChange={state.changeStudent}
                    onAdd={state.addStudent}
                    onRemove={state.removeStudent}
                />
                <SessionScheduleFields
                    values={form.data}
                    errors={errors}
                    disabled={disabled}
                    startTimes={options.startTimes}
                    endTimes={options.endTimes}
                    onDateChange={(value) => form.setData('session_date', value)}
                    onStartTimeChange={state.changeStartTime}
                    onEndTimeChange={(value) => form.setData('end_time', value)}
                />
            </FormGrid>
        </FormSection>
    );
}
