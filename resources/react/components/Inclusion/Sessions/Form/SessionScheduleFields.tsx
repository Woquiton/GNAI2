import { optionsFromRecord } from '@/components/Forms/FormFields/fieldOptions';
import { DateInputField, SelectInputField } from '@/components/Forms/FormFields/FormFields';
import FormGrid from '@/components/Forms/FormGrid/FormGrid';
import { localDate } from '../Sessions.constants';
import type { SessionTimeOptions } from '../Sessions.types';
import { endTimeOptions } from './SessionForm.utils';

/** Data e horário do agendamento ou do atendimento registrado. */
export interface SessionScheduleValues {
    session_date: string;
    start_time: string;
    end_time: string;
}

interface SessionScheduleFieldsProps extends Pick<SessionTimeOptions, 'startTimes' | 'endTimes'> {
    values: SessionScheduleValues;
    errors: Record<string, string | undefined>;
    disabled: boolean;
    dateLabel?: string;
    /** Atendimento já realizado: sem datas futuras no calendário e sem o destaque de hoje. */
    pastOnly?: boolean;
    onDateChange: (value: string) => void;
    onStartTimeChange: (value: string) => void;
    onEndTimeChange: (value: string) => void;
}

/** Data, início e fim do agendamento; o fim acompanha o turno do início escolhido. */
export default function SessionScheduleFields({
    values,
    errors,
    disabled,
    startTimes,
    endTimes,
    dateLabel = 'Data do Agendamento',
    pastOnly = false,
    onDateChange,
    onStartTimeChange,
    onEndTimeChange,
}: SessionScheduleFieldsProps): React.JSX.Element {
    return (
        <>
            <DateInputField
                id="session-date"
                name="session_date"
                label={dateLabel}
                required
                disabled={disabled}
                value={values.session_date}
                error={errors.session_date}
                highlightToday={!pastOnly}
                maxDate={pastOnly ? localDate() : undefined}
                onChange={onDateChange}
            />
            <FormGrid columns={2} className="sessionForm__times">
                <SelectInputField
                    id="session-start-time"
                    name="start_time"
                    label="Início"
                    required
                    disabled={disabled}
                    value={values.start_time}
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
                    value={values.end_time}
                    options={endTimeOptions(endTimes, values.start_time)}
                    error={errors.end_time}
                    onChange={onEndTimeChange}
                />
            </FormGrid>
        </>
    );
}
