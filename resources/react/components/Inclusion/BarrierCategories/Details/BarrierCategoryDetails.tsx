import FormSection from '@/components/Forms/FormSection/FormSection';
import CardBox from '@/components/UI/CardBox/CardBox';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import ExpandableContent from '@/components/UI/ExpandableContent/ExpandableContent';
import RichTextContent from '@/components/UI/RichTextContent/RichTextContent';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import type { BarrierCategoryShowProps } from '../BarrierCategories.types';

type BarrierCategoryDetailsProps = Omit<BarrierCategoryShowProps, 'can'>;

/** Identificação, vínculos, status e comportamento do mapa de uma categoria de barreira. */
export default function BarrierCategoryDetails({
    barrierCategory: category,
    display,
}: BarrierCategoryDetailsProps): React.JSX.Element {
    return (
        <CardBox>
            <FormSection
                id="barrier-category-show-information"
                title="Identificação"
                variant="inline"
                iconClass="fa fa-tags"
            >
                <DetailGrid>
                    <DetailField label="Nome da Categoria" wide>
                        {category.name}
                    </DetailField>
                    <DetailField label="Descrição Detalhada" wide>
                        <ExpandableContent>
                            <RichTextContent html={display.descriptionHtml} />
                        </ExpandableContent>
                    </DetailField>
                    {category.barriers_count !== undefined ? (
                        <DetailField label="Barreiras Vinculadas">
                            {category.barriers_count}
                        </DetailField>
                    ) : null}
                </DetailGrid>
                <DetailGrid>
                    <DetailField label="Ativo no Sistema">
                        <TableLabel tone={category.is_active ? 'success' : 'inverse'}>
                            {category.is_active ? 'Sim' : 'Não'}
                        </TableLabel>
                    </DetailField>
                    <DetailField label="Mapa se Aplica">
                        <TableLabel tone={category.blocks_map ? 'danger' : 'success'}>
                            {category.blocks_map ? 'Não' : 'Sim'}
                        </TableLabel>
                    </DetailField>
                </DetailGrid>
            </FormSection>
        </CardBox>
    );
}
