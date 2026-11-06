import FormSection from '@/components/Forms/FormSection/FormSection';
import CardBox from '@/components/UI/CardBox/CardBox';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import RichTextContent from '@/components/UI/RichTextContent/RichTextContent';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import TagList from '@/components/UI/TagList/TagList';
import type { PositionDetailsRecord } from '../Positions.types';
import { POSITION_TOUR_TARGETS } from '../positionTours';

/** Informações, atribuições e permissões vinculadas de um cargo. */
export default function PositionDetails({
    position,
    descriptionHtml,
}: {
    position: PositionDetailsRecord;
    descriptionHtml: string;
}): React.JSX.Element {
    return (
        <CardBox>
            <FormSection
                id="position-show-information"
                title="Identificação"
                variant="inline"
                iconClass="fa fa-briefcase"
                tourTarget={POSITION_TOUR_TARGETS.detailsIdentification}
            >
                <DetailGrid>
                    <DetailField label="Nome do Cargo / Função">{position.name}</DetailField>
                    <DetailField label="Status de Disponibilidade">
                        <TableLabel tone={position.is_active ? 'success' : 'inverse'}>
                            {position.is_active ? 'Ativo' : 'Desativado'}
                        </TableLabel>
                    </DetailField>
                    <DetailField label="Descrição da Função" wide>
                        <RichTextContent html={descriptionHtml} />
                    </DetailField>
                </DetailGrid>
            </FormSection>
            <FormSection
                id="position-show-permissions"
                title="Permissões Vinculadas ao Cargo"
                variant="inline"
                iconClass="fa fa-key"
                tourTarget={POSITION_TOUR_TARGETS.detailsPermissions}
            >
                <DetailGrid>
                    <DetailField label="Permissões Vinculadas" wide>
                        <TagList items={position.permissions ?? []} emptyMessage="---" />
                    </DetailField>
                </DetailGrid>
            </FormSection>
        </CardBox>
    );
}
