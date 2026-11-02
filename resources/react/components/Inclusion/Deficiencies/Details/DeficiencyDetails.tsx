import FormSection from '@/components/Forms/FormSection/FormSection';
import CardBox from '@/components/UI/CardBox/CardBox';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import RichTextContent from '@/components/UI/RichTextContent/RichTextContent';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import type { DeficiencyRecord } from '../Deficiencies.types';

/** Identificação clínica e descrição técnica de um perfil de atendimento. */
export default function DeficiencyDetails({
    deficiency,
    descriptionHtml,
}: {
    deficiency: DeficiencyRecord;
    descriptionHtml: string;
}): React.JSX.Element {
    return (
        <CardBox>
            <FormSection
                id="deficiency-show-identification"
                title="Identificação Clínica"
                variant="inline"
                iconClass="fa fa-id-card-o"
            >
                <DetailGrid>
                    <DetailField label="Nome do Perfil">
                        <strong>{deficiency.name}</strong>
                    </DetailField>
                    <DetailField label="Código CID">
                        {deficiency.cid_code || 'Não informado'}
                    </DetailField>
                    <DetailField label="Status no Sistema">
                        <TableLabel tone={deficiency.is_active ? 'success' : 'inverse'}>
                            {deficiency.is_active ? 'Ativa' : 'Inativa'}
                        </TableLabel>
                    </DetailField>
                </DetailGrid>
            </FormSection>
            <FormSection
                id="deficiency-show-description"
                title="Descrição e Observações Técnicas"
                variant="inline"
                iconClass="fa fa-file-text-o"
            >
                <DetailGrid>
                    <DetailField label="Descrição Detalhada" wide>
                        <RichTextContent html={descriptionHtml} />
                    </DetailField>
                </DetailGrid>
            </FormSection>
        </CardBox>
    );
}
