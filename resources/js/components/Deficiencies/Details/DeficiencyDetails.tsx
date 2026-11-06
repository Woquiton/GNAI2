import FormSection from '@/components/Forms/FormSection/FormSection';
import CardBox from '@/components/UI/CardBox/CardBox';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import RichTextContent from '@/components/UI/RichTextContent/RichTextContent';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import type { DeficiencyRecord } from '../Deficiencies.types';
import { DEFICIENCY_TOUR_TARGETS } from '../deficiencyTours';

/** Identificação e descrição de um perfil de atendimento. */
export default function DeficiencyDetails({
    deficiency,
    descriptionHtml,
}: {
    deficiency: DeficiencyRecord;
    descriptionHtml: string;
}): React.JSX.Element {
    return (
        <CardBox tourTarget={DEFICIENCY_TOUR_TARGETS.details}>
            <FormSection
                id="deficiency-show-identification"
                title="Identificação"
                variant="inline"
                iconClass="fa fa-list-alt"
            >
                <DetailGrid>
                    <DetailField label="Nome do Perfil">{deficiency.name}</DetailField>
                    <DetailField label="Código CID">
                        {deficiency.cid_code || 'Não informado'}
                    </DetailField>
                    <DetailField label="Status no Sistema">
                        <TableLabel tone={deficiency.is_active ? 'success' : 'inverse'}>
                            {deficiency.is_active ? 'Ativa' : 'Inativa'}
                        </TableLabel>
                    </DetailField>
                    <DetailField label="Descrição / Detalhes" wide>
                        <RichTextContent html={descriptionHtml} />
                    </DetailField>
                </DetailGrid>
            </FormSection>
        </CardBox>
    );
}
