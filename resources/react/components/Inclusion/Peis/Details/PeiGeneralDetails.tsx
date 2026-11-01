import FormSection from '@/components/Forms/FormSection/FormSection';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import TagList from '@/components/UI/TagList/TagList';
import { dateLabel } from '@/utils/formatters';
import { NOT_INFORMED, peiRecordVersionLabel } from '../Peis.constants';
import type { PeiShowRecord, PeiShowStudent } from '../Peis.types';
import PeiStatusLabel from './PeiStatusLabel';

interface PeiGeneralDetailsProps {
    pei: PeiShowRecord;
    student: PeiShowStudent;
}

/** Aba "Dados do PEI": responsável, curso, semestre, versão, status e perfis de atendimento. */
export default function PeiGeneralDetails({
    pei,
    student,
}: PeiGeneralDetailsProps): React.JSX.Element {
    const deficiencies = student.deficiencies.map((name) => ({ id: name, name }));

    return (
        <FormSection
            id="pei-details"
            title="Dados do PEI"
            iconClass="fa fa-file-text-o"
            variant="inline"
        >
            <DetailGrid columns={3}>
                <DetailField label="Responsável">{pei.responsible}</DetailField>
                <DetailField label="Curso">{pei.course_name || NOT_INFORMED}</DetailField>
                <DetailField label="Semestre">{pei.semester_label || NOT_INFORMED}</DetailField>
                <DetailField label="Versão">
                    <strong>{peiRecordVersionLabel(pei)}</strong>
                </DetailField>
                <DetailField label="Criado em">{dateLabel(pei.created_at)}</DetailField>
                <DetailField label="Status">
                    <PeiStatusLabel pei={pei} />
                </DetailField>
                <DetailField label="Perfis de atendimento" wide>
                    <TagList
                        items={deficiencies}
                        emptyMessage="Nenhum perfil de atendimento registrado."
                    />
                </DetailField>
            </DetailGrid>
        </FormSection>
    );
}
