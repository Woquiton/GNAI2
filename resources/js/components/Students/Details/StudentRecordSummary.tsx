import CardBox from '@/components/UI/CardBox/CardBox';
import DetailField from '@/components/UI/DetailField/DetailField';
import RecordSummary from '@/components/UI/RecordSummary/RecordSummary';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { dateLabel } from '@/utils/formatters';
import type { StudentOptions, StudentRecord } from '../Students.types';
import { STUDENT_TOUR_TARGETS } from '../studentTours';

type StudentRecordSummaryProps = StudentOptions & {
    student: StudentRecord;
    profileNames: string[];
};

/** Identificação compacta com situação e tipo de acompanhamento separados. */
export default function StudentRecordSummary({
    student,
    permissions,
    studentStatuses,
    statusColors,
    followUpTypes,
    profileNames,
}: StudentRecordSummaryProps): React.JSX.Element {
    const person = student.person;
    const canViewProfiles = permissions['student-deficiency.view'];
    const profileSummary = profileNames.join(', ');

    return (
        <CardBox className="studentDetails__summaryCard" tourTarget={STUDENT_TOUR_TARGETS.summary}>
            <RecordSummary
                photo={{ src: person.photo_url, alt: `Foto de ${person.name}` }}
                name={person.name}
                className="studentDetails__summary"
            >
                <DetailField label="Matrícula">{student.registration || '---'}</DetailField>
                <DetailField label="Situação">
                    <TableLabel tone={statusColors[student.status] ?? 'inverse'}>
                        {studentStatuses[student.status] ?? student.status}
                    </TableLabel>
                </DetailField>
                <DetailField label="Tipo de acompanhamento">
                    {followUpTypes[student.follow_up_type ?? ''] ?? 'Não informado'}
                </DetailField>
                <DetailField label="Data de ingresso">{dateLabel(student.entry_date)}</DetailField>
                {canViewProfiles ? (
                    <DetailField label="Perfil de atendimento" wide>
                        {profileSummary || 'Nenhum perfil cadastrado'}
                    </DetailField>
                ) : null}
            </RecordSummary>
        </CardBox>
    );
}
