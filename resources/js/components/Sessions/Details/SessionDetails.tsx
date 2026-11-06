import FormSection from '@/components/Forms/FormSection/FormSection';
import CardBox from '@/components/UI/CardBox/CardBox';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import RichTextContent from '@/components/UI/RichTextContent/RichTextContent';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { dateLabel } from '@/utils/formatters';
import SessionStudentNames from '../SessionStudentNames';
import type { SessionDetailsRecord } from '../Sessions.types';
import { SESSION_TOUR_TARGETS } from '../sessionTours';

interface SessionDetailsProps {
    session: SessionDetailsRecord;
}

/** Identificação, agendamento e conteúdo de um agendamento de atendimento. */
export default function SessionDetails({ session }: SessionDetailsProps): React.JSX.Element {
    const students = session.student_names.length ? (
        <SessionStudentNames names={session.student_names} />
    ) : (
        'Sem alunos'
    );
    const schedule = `${session.start_time ?? '--:--'} às ${session.end_time ?? '--:--'}`;

    return (
        <CardBox>
            <FormSection
                id="session-identification"
                tourTarget={SESSION_TOUR_TARGETS.detailsIdentification}
                title="Identificação"
                variant="inline"
                iconClass="fa fa-id-card-o"
            >
                <DetailGrid>
                    <DetailField label="Alunos">{students}</DetailField>
                    <DetailField label="Profissional">{session.professional_name}</DetailField>
                    <DetailField label="Status">
                        <TableLabel tone={session.status_color}>
                            {session.status_label}
                        </TableLabel>
                    </DetailField>
                </DetailGrid>
            </FormSection>
            <FormSection
                id="session-schedule"
                tourTarget={SESSION_TOUR_TARGETS.detailsSchedule}
                title="Agendamento e Local"
                variant="inline"
                iconClass="fa fa-calendar"
            >
                <DetailGrid columns={3}>
                    <DetailField label="Data">{dateLabel(session.session_date)}</DetailField>
                    <DetailField label="Horário">{schedule}</DetailField>
                    <DetailField label="Local">{session.location || '---'}</DetailField>
                    <DetailField label="Tipo de Atendimento">
                        {session.attendance_type_label}
                    </DetailField>
                    <DetailField label="Formato">{session.type_label}</DetailField>
                    <DetailField label="Origem">{session.origin_label}</DetailField>
                </DetailGrid>
            </FormSection>
            <FormSection
                id="session-content"
                tourTarget={SESSION_TOUR_TARGETS.detailsContent}
                title="Conteúdo do Agendamento"
                variant="inline"
                iconClass="fa fa-file-text-o"
            >
                <DetailGrid>
                    <DetailField label="Objetivo do Agendamento" wide>
                        {session.session_objective_html ? (
                            <RichTextContent html={session.session_objective_html} />
                        ) : (
                            '---'
                        )}
                    </DetailField>
                    {session.cancellation_reason ? (
                        <DetailField label="Motivo do Cancelamento" wide preserveLineBreaks>
                            {session.cancellation_reason}
                        </DetailField>
                    ) : null}
                </DetailGrid>
            </FormSection>
        </CardBox>
    );
}
