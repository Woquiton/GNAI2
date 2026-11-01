import { optionsFromRecord } from '@/components/Forms/FormFields/fieldOptions';
import { DateInputField, SelectInputField } from '@/components/Forms/FormFields/FormFields';
import FormGrid from '@/components/Forms/FormGrid/FormGrid';
import type { SessionTimeOptions } from '../Sessions.types';
import type { SessionFormSectionProps } from './SessionForm.types';
import { endTimeOptions } from './SessionForm.utils';

interface SessionScheduleFieldsProps
    extends SessionFormSectionProps, Pick<SessionTimeOptions, 'startTimes' | 'endTimes'> {
    onStartTimeChange: (value: string) => void;
}

/** Data, início e fim do agendamento; o fim acompanha o turno do início escolhido. */
export default function SessionScheduleFields({
    form,
    errors,
    disabled,
    startTimes,
    endTimes,
    onStartTimeChange,
}: SessionScheduleFieldsProps): React.JSX.Element {
    return (
        <>
            <DateInputField
                id="session-date"
                name="session_date"
                label="Data do Agendamento"
                required
                disabled={disabled}
                value={form.data.session_date}
                error={errors.session_date}
                onChange={(value) => form.setData('session_date', value)}
            />
            <FormGrid columns={2} className="sessionForm__times">
                <SelectInputField
                    id="session-start-time"
                    name="start_time"
                    label="Início"
                    required
                    disabled={disabled}
                    value={form.data.start_time}
                    options={optionsFromRecord(startTimes)}
                    error={errors.start_time}
                    onChange={onStartTimeChange}
                />
                <SelectInputField
                    id="session-end-time"
                    name="end_time"
                    label="Fim"
                    required
                    disabled={disabled}
                    value={form.data.end_time}
                    options={endTimeOptions(endTimes, form.data.start_time)}
                    error={errors.end_time}
                    onChange={(value) => form.setData('end_time', value)}
                />
            </FormGrid>
        </>
    );
}
