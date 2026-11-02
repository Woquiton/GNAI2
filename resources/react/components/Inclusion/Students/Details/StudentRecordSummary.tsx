import FormSection from '@/components/Forms/FormSection/FormSection';
import CardBox from '@/components/UI/CardBox/CardBox';
import DetailField from '@/components/UI/DetailField/DetailField';
import RecordSummary from '@/components/UI/RecordSummary/RecordSummary';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import type { StudentOptions, StudentRecord } from '../Students.types';

type StudentRecordSummaryProps = StudentOptions & { student: StudentRecord };

/** Identificação compacta no topo do prontuário: foto, nome, matrícula, status e perfis. */
export default function StudentRecordSummary({
    student,
    permissions,
    studentStatuses,
    statusColors,
}: StudentRecordSummaryProps): React.JSX.Element {
    const person = student.person;
    const canViewProfiles = permissions['student-deficiency.view'];
    const profileNames = student.deficiencies?.map((item) => item.name).join(', ');

    return (
        <CardBox>
            <FormSection
                id="identificacao"
                title="Identificação do Aluno"
                iconClass="fa fa-user"
                variant="inline"
            >
                <RecordSummary
                    photo={{ src: person.photo_url, alt: `Foto de ${person.name}` }}
                    name={person.name}
                >
                    <DetailField label="Matrícula">{student.registration || '---'}</DetailField>
                    <DetailField label="Status">
                        <TableLabel tone={statusColors[student.status] ?? 'inverse'}>
                            {studentStatuses[student.status] ?? student.status}
                        </TableLabel>
                    </DetailField>
                    {canViewProfiles ? (
                        <DetailField label="Perfil de atendimento" wide>
                            {profileNames || 'Nenhum perfil cadastrado'}
                        </DetailField>
                    ) : null}
                </RecordSummary>
            </FormSection>
        </CardBox>
    );
}
