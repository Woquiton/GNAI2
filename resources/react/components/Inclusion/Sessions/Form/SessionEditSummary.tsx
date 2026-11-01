import FormGrid from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import SessionStudentNames from '../SessionStudentNames';
import type { SessionEditProps } from '../Sessions.types';
import type { SessionFormSectionProps } from './SessionForm.types';
import { personName } from './SessionForm.utils';
import SessionScheduleFields from './SessionScheduleFields';

interface SessionEditSummaryProps extends SessionFormSectionProps {
    options: SessionEditProps;
    onStartTimeChange: (value: string) => void;
}

/**
 * Edição: participantes, tipo e formato ficam somente para leitura; data e horário continuam
 * editáveis.
 */
export default function SessionEditSummary({
    form,
    errors,
    disabled,
    options,
    onStartTimeChange,
}: SessionEditSummaryProps): React.JSX.Element {
    const { session, sessionForm } = options;
    const studentNames = session.students.map((student) => personName(student));
    const participantsError = errors.student_ids ?? errors.professional_id;
    const attendanceTypeLabel =
        options.attendanceTypes[sessionForm.attendance_type] ?? sessionForm.attendance_type;
    const sessionTypeLabel = options.sessionTypes[session.type] ?? session.type;

    return (
        <>
            <FormSection
                id="session-participants"
                title="Participantes"
                variant="inline"
                iconClass="fa fa-users"
            >
                <DetailGrid>
                    <DetailField label="Alunos">
                        <SessionStudentNames names={studentNames} />
                    </DetailField>
                    <DetailField label="Profissional Responsável">
                        {personName(session.professional)}
                    </DetailField>
                </DetailGrid>
                {participantsError ? (
                    <p className="formField__error" role="alert">
                        {participantsError}
                    </p>
                ) : null}
            </FormSection>
            <FormSection
                id="session-schedule"
                title="Agendamento"
                variant="inline"
                iconClass="fa fa-calendar"
            >
                <DetailGrid>
                    <DetailField label="Tipo de Atendimento">{attendanceTypeLabel}</DetailField>
                    <DetailField label="Formato">{sessionTypeLabel}</DetailField>
                </DetailGrid>
                <FormGrid columns={2}>
                    <SessionScheduleFields
                        form={form}
                        errors={errors}
                        disabled={disabled}
                        startTimes={options.startTimes}
                        endTimes={options.endTimes}
                        onStartTimeChange={onStartTimeChange}
                    />
                </FormGrid>
            </FormSection>
        </>
    );
}
