import FormSection from '@/components/Forms/FormSection/FormSection';
import CardBox from '@/components/UI/CardBox/CardBox';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import ExpandableContent from '@/components/UI/ExpandableContent/ExpandableContent';
import RichTextContent from '@/components/UI/RichTextContent/RichTextContent';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import type { AccessibilityFeatureShowProps } from '../AccessibilityFeatures.types';
import { ACCESSIBILITY_FEATURE_TOUR_TARGETS } from '../accessibilityFeatureTours';

type AccessibilityFeatureDetailsProps = Omit<AccessibilityFeatureShowProps, 'can'>;

/** Identificação, descrição, status e itens vinculados de um recurso de acessibilidade. */
export default function AccessibilityFeatureDetails({
    feature,
    display,
}: AccessibilityFeatureDetailsProps): React.JSX.Element {
    return (
        <CardBox tourTarget={ACCESSIBILITY_FEATURE_TOUR_TARGETS.details}>
            <FormSection
                id="accessibility-feature-show-identification"
                title="Identificação"
                variant="inline"
                iconClass="fa fa-list-alt"
            >
                <DetailGrid>
                    <DetailField label="Nome do Recurso" wide>
                        {feature.name}
                    </DetailField>
                    <DetailField label="Descrição Detalhada" wide>
                        <div data-tour={ACCESSIBILITY_FEATURE_TOUR_TARGETS.detailsDescription}>
                            <ExpandableContent>
                                <RichTextContent html={display.descriptionHtml} />
                            </ExpandableContent>
                        </div>
                    </DetailField>
                    <DetailField label="Recurso Ativo">
                        <TableLabel tone={feature.is_active ? 'success' : 'inverse'}>
                            {feature.is_active ? 'Ativo' : 'Inativo'}
                        </TableLabel>
                    </DetailField>
                    {feature.items_count !== undefined ? (
                        <DetailField label="Itens Vinculados">{feature.items_count}</DetailField>
                    ) : null}
                </DetailGrid>
            </FormSection>
        </CardBox>
    );
}
