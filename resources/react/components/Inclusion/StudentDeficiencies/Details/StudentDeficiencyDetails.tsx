import FormSection from '@/components/Forms/FormSection/FormSection';
import CardBox from '@/components/UI/CardBox/CardBox';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import RichTextContent from '@/components/UI/RichTextContent/RichTextContent';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { dateTimeLabel } from '@/utils/formatters';
import type { StudentDeficiencyShowRecord } from '../StudentDeficiencies.types';
import { STUDENT_DEFICIENCY_TOUR_TARGETS } from '../studentDeficiencyTours';

interface StudentDeficiencyDetailsProps {
    deficiency: StudentDeficiencyShowRecord;
    profileName: string;
}

/** Diagnóstico do perfil de atendimento do aluno: perfil, severidade, registro e observações. */
export default function StudentDeficiencyDetails({
    deficiency,
    profileName,
}: StudentDeficiencyDetailsProps): React.JSX.Element {
    const severity = deficiency.severity_label ? (
        <TableLabel tone={deficiency.severity_color ?? 'inverse'}>
            {deficiency.severity_label}
        </TableLabel>
    ) : (
        'Não informada'
    );

    return (
        <CardBox>
            <FormSection
                id="student-deficiency-diagnosis"
                title="Informações do Diagnóstico"
                variant="inline"
                iconClass="fa fa-stethoscope"
                tourTarget={STUDENT_DEFICIENCY_TOUR_TARGETS.details}
            >
                <DetailGrid>
                    <DetailField label="Nome do Perfil">{profileName}</DetailField>
                    <DetailField label="Severidade">{severity}</DetailField>
                    <DetailField label="Data do Registro">
                        {dateTimeLabel(deficiency.created_at)}
                    </DetailField>
                    <DetailField label="Observações Técnicas" wide>
                        <RichTextContent html={deficiency.notes_html} />
                    </DetailField>
                </DetailGrid>
            </FormSection>
        </CardBox>
    );
}
