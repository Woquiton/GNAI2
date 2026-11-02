import CardBox from '@/components/UI/CardBox/CardBox';
import DetailField from '@/components/UI/DetailField/DetailField';
import RecordSummary from '@/components/UI/RecordSummary/RecordSummary';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import type { StudentOptions, StudentRecord } from '../Students.types';

type StudentRecordSummaryProps = StudentOptions & {
    student: StudentRecord;
    profileNames: string[];
};

/** Identificação compacta no topo do prontuário: foto, nome, matrícula, status e perfis. */
export default function StudentRecordSummary({
    student,
    permissions,
    studentStatuses,
    statusColors,
    profileNames,
}: StudentRecordSummaryProps): React.JSX.Element {
    const person = student.person;
    const canViewProfiles = permissions['student-deficiency.view'];
    const profileSummary = profileNames.join(', ');

    return (
        <CardBox className="studentDetails__summaryCard">
            <RecordSummary
                photo={{ src: person.photo_url, alt: `Foto de ${person.name}` }}
                name={person.name}
                className="studentDetails__summary"
            >
                <DetailField label="Matrícula">{student.registration || '---'}</DetailField>
                <DetailField label="Status">
                    <TableLabel tone={statusColors[student.status] ?? 'inverse'}>
                        {studentStatuses[student.status] ?? student.status}
                    </TableLabel>
                </DetailField>
                {canViewProfiles ? (
                    <DetailField label="Perfil de atendimento" wide>
                        {profileSummary || 'Nenhum perfil cadastrado'}
                    </DetailField>
                ) : null}
            </RecordSummary>
        </CardBox>
    );
}
