import FormActions from '@/components/Forms/FormActions/FormActions';
import FormSection from '@/components/Forms/FormSection/FormSection';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import ExpandableContent from '@/components/UI/ExpandableContent/ExpandableContent';
import RichTextContent from '@/components/UI/RichTextContent/RichTextContent';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import InspectionEvidenceCarousel from '../InspectionEvidenceCarousel/InspectionEvidenceCarousel';
import type { InspectionFavoriteOptions } from '../InspectionEvidenceCarousel/InspectionEvidenceCarousel.types';
import { INSPECTION_TOUR_TARGETS } from '../inspectionTours';
import type { InspectionDetailsData, InspectionDetailsSubject } from './InspectionDetails.types';
import './InspectionDetails.css';

interface InspectionDetailsProps {
    inspection: InspectionDetailsData;
    subject: InspectionDetailsSubject;
    favorite?: InspectionFavoriteOptions;
}

/** Data da vistoria exibida nas ações do cabeçalho da página. */
export function InspectionDateBadge({ date }: { date: string }): React.JSX.Element {
    return (
        <div className="inspectionDetails__date">
            <span>Data da inspeção</span>
            <TableLabel tone="purple">{date}</TableLabel>
        </div>
    );
}

/** Dados gerais, parecer e carrossel de evidências da vistoria de um recurso. */
export default function InspectionDetails({
    inspection,
    subject,
    favorite,
}: InspectionDetailsProps): React.JSX.Element {
    const evidences = inspection.evidences.length ? (
        <InspectionEvidenceCarousel evidences={inspection.evidences} favorite={favorite} />
    ) : (
        <div className="inspectionDetails__empty">
            <i className="fa fa-paperclip" aria-hidden="true" />
            <p>Nenhuma evidência registrada para esta inspeção.</p>
        </div>
    );

    return (
        <>
            <CardBox>
                <FormSection
                    id="inspection-general"
                    title="Informações Gerais"
                    variant="inline"
                    iconClass="fa fa-search"
                    tourTarget={INSPECTION_TOUR_TARGETS.general}
                >
                    <DetailGrid>
                        <DetailField label="Estado de Conservação">
                            {inspection.stateLabel}
                        </DetailField>
                        <DetailField label="Tipo de Inspeção">{inspection.typeLabel}</DetailField>
                        <DetailField label="Parecer Técnico / Descrição" wide>
                            <ExpandableContent>
                                <RichTextContent html={inspection.descriptionHtml} />
                            </ExpandableContent>
                        </DetailField>
                    </DetailGrid>
                </FormSection>
                <FormSection
                    id="inspection-evidences"
                    title="Evidências"
                    variant="inline"
                    iconClass="fa fa-paperclip"
                    tourTarget={INSPECTION_TOUR_TARGETS.evidences}
                >
                    {evidences}
                </FormSection>
            </CardBox>
            <FormActions tourTarget={INSPECTION_TOUR_TARGETS.actions}>
                <Button
                    href={subject.href}
                    tone="cancel"
                    label="Voltar"
                    title={`Voltar para ${subject.name}`}
                    aria-label={`Voltar para ${subject.name}`}
                />
            </FormActions>
        </>
    );
}
