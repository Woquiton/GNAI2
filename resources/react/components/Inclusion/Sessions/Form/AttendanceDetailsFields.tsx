import FormField from '@/components/Forms/FormField/FormField';
import { optionsFromRecord } from '@/components/Forms/FormFields/fieldOptions';
import { SelectInputField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import FormGrid from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import TextInput from '@/components/Forms/TextInput/TextInput';
import { localDate } from '../Sessions.constants';
import type { SessionOptionMap, SessionPersonOption, SessionTimeOptions } from '../Sessions.types';
import SessionAvailability from './SessionAvailability';
import { personOptions } from './SessionForm.utils';
import SessionScheduleFields, { type SessionScheduleValues } from './SessionScheduleFields';
import SessionStudentRows from './SessionStudentRows';
import type { StudentRowsState } from './useStudentRows';
import './SessionForm.css';

/** Cabeçalho do atendimento enviado junto do registro (`student_ids` só no registro direto). */
export interface AttendanceDetailsValues extends SessionScheduleValues {
    location: string;
    student_ids: string[];
    type?: string;
}

export type AttendanceDetailsField = 'session_date' | 'end_time' | 'location';

/** Valor definido pelo sistema, exibido como campo travado. */
function LockedField({
    id,
    label,
    value,
}: {
    id: string;
    label: string;
    value: string;
}): React.JSX.Element {
    return (
        <FormField id={id} label={label}>
            <TextInput id={id} value={value} disabled readOnly />
        </FormField>
    );
}

/** Registro direto: escolha dos alunos e, no AEE, do formato. */
interface AttendanceStudentSelection {
    students: SessionPersonOption[];
    rows: StudentRowsState;
    canAdd: boolean;
    /** Ausente no atendimento pedagógico, que é sempre individual. */
    sessionTypes?: SessionOptionMap;
    onStudentChange: (index: number, value: string) => void;
    onTypeChange?: (value: string) => void;
}

interface AttendanceDetailsFieldsProps extends Pick<SessionTimeOptions, 'startTimes' | 'endTimes'> {
    values: AttendanceDetailsValues;
    errors: Record<string, string | undefined>;
    disabled: boolean;
    attendanceTypeLabel: string;
    professional: { id: number; name: string | null };
    /** Registro direto; na edição, os alunos ficam somente para leitura em `studentNames`. */
    selection?: AttendanceStudentSelection;
    studentNames?: string[];
    onChange: (field: AttendanceDetailsField, value: string) => void;
    onStartTimeChange: (value: string) => void;
}

/**
 * Data, horário, local e participantes do atendimento registrado, com a disponibilidade do dia.
 * No registro direto, cria o agendamento do atendimento; na edição do registro, corrige o dele.
 * O profissional é sempre o do usuário logado.
 */
export default function AttendanceDetailsFields({
    values,
    errors,
    disabled,
    startTimes,
    endTimes,
    attendanceTypeLabel,
    professional,
    selection,
    studentNames,
    onChange,
    onStartTimeChange,
}: AttendanceDetailsFieldsProps): React.JSX.Element {
    const professionalName = professional.name ?? 'Profissional não informado';
    // O backend recusa datas futuras; o aviso antecipa a recusa antes do envio.
    const futureDateMessage =
        values.session_date > localDate()
            ? 'Não é possível usar uma data futura: este registro é de um atendimento que já aconteceu. Para um atendimento futuro, crie um agendamento.'
            : undefined;
    const readOnlyStudents = studentNames ? (
        <LockedField id="session-students" label="Alunos" value={studentNames.join(', ')} />
    ) : null;
    const typeField = selection?.sessionTypes ? (
        <SelectInputField
            id="session-type"
            name="type"
            label="Formato"
            required
            disabled={disabled}
            value={values.type ?? ''}
            options={optionsFromRecord(selection.sessionTypes)}
            error={errors.type}
            onChange={(value) => selection.onTypeChange?.(value)}
        />
    ) : null;
    const studentRows = selection ? (
        <SessionStudentRows
            studentIds={values.student_ids}
            errors={errors}
            disabled={disabled}
            studentOptions={personOptions(selection.students)}
            rowKeys={selection.rows.rowKeys}
            canAdd={selection.canAdd}
            onChange={selection.onStudentChange}
            onAdd={selection.rows.add}
            onRemove={selection.rows.remove}
        />
    ) : null;

    return (
        <>
            <FormSection
                id="attendance-details"
                title="Dados do Atendimento"
                variant="inline"
                iconClass="fa fa-calendar"
            >
                <FormGrid columns={2}>
                    <LockedField
                        id="session-attendance-type"
                        label="Tipo de Atendimento"
                        value={attendanceTypeLabel}
                    />
                    <LockedField
                        id="session-professional"
                        label="Profissional Responsável"
                        value={professionalName}
                    />
                    {readOnlyStudents}
                    {typeField}
                    {studentRows}
                    <SessionScheduleFields
                        values={values}
                        errors={errors}
                        disabled={disabled}
                        startTimes={startTimes}
                        endTimes={endTimes}
                        dateLabel="Data do Atendimento"
                        pastOnly
                        onDateChange={(value) => onChange('session_date', value)}
                        onStartTimeChange={onStartTimeChange}
                        onEndTimeChange={(value) => onChange('end_time', value)}
                    />
                    <TextInputField
                        id="session-location"
                        name="location"
                        label="Local"
                        required
                        maxLength={255}
                        disabled={disabled}
                        value={values.location}
                        error={errors.location}
                        onChange={(value) => onChange('location', value)}
                    />
                </FormGrid>
            </FormSection>
            <FormSection
                id="attendance-availability"
                title="Disponibilidade do Dia"
                variant="inline"
                iconClass="fa fa-clock-o"
            >
                <SessionAvailability
                    date={values.session_date}
                    professionalId={String(professional.id)}
                    studentIds={values.student_ids}
                    selectedTime={values.start_time}
                    disabled={disabled}
                    blockedMessage={futureDateMessage}
                    onSelect={onStartTimeChange}
                />
            </FormSection>
        </>
    );
}
