import FormActions from '@/components/Forms/FormActions/FormActions';
import FormSection from '@/components/Forms/FormSection/FormSection';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import RichTextContent from '@/components/UI/RichTextContent/RichTextContent';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { dateLabel } from '@/utils/formatters';
import {
    barrierStatusLabels,
    inspectionStatusTone,
    inspectionTypeLabels,
} from '../Barriers.constants';
import { barrierUrls, evidenceUrl } from '../Barriers.routes';
import type { BarrierEvidence, BarrierInspectionShowProps } from '../Barriers.types';
import './BarrierInspectionDetails.css';

function EvidenceLink({ evidence }: { evidence: BarrierEvidence }): React.JSX.Element {
    const url = evidenceUrl(evidence.path);
    const name = evidence.original_name ?? evidence.path.split('/').pop();
    const preview = evidence.mime_type?.startsWith('image/') ? (
        <img src={url} alt={evidence.original_name ?? 'Evidência da vistoria'} loading="lazy" />
    ) : (
        <i className="fa fa-file-text-o" aria-hidden="true" />
    );

    return (
        <a
            className="barrierInspectionDetails__evidence"
            href={url}
            target="_blank"
            rel="noreferrer"
        >
            {preview}
            <span>{name}</span>
        </a>
    );
}

/** Situação, tipo, parecer e evidências (abertas em nova aba) de uma vistoria da barreira. */
export default function BarrierInspectionDetails({
    barrier,
    inspection,
    descriptionHtml,
}: BarrierInspectionShowProps): React.JSX.Element {
    const evidences = inspection.evidences ?? [];
    const typeLabel =
        inspectionTypeLabels[inspection.type ?? ''] ?? inspection.type ?? 'Não informado';

    return (
        <>
            <CardBox>
                <FormSection
                    id="barrier-inspection-details"
                    title="Informações Gerais"
                    variant="inline"
                    iconClass="fa fa-clipboard"
                >
                    <DetailGrid>
                        <DetailField label="Status da Barreira">
                            <TableLabel tone={inspectionStatusTone(inspection.status)}>
                                {barrierStatusLabels[inspection.status ?? ''] ?? 'Identificada'}
                            </TableLabel>
                        </DetailField>
                        <DetailField label="Tipo de Inspeção">{typeLabel}</DetailField>
                        <DetailField label="Data da Inspeção">
                            {dateLabel(inspection.inspection_date)}
                        </DetailField>
                        <DetailField label="Parecer Técnico / Descrição" wide>
                            <RichTextContent html={descriptionHtml} />
                        </DetailField>
                    </DetailGrid>
                </FormSection>
                <FormSection
                    id="barrier-inspection-evidence"
                    title="Evidências"
                    variant="inline"
                    iconClass="fa fa-paperclip"
                >
                    {evidences.length ? (
                        <div className="barrierInspectionDetails__evidences">
                            {evidences.map((evidence) => (
                                <EvidenceLink key={evidence.id} evidence={evidence} />
                            ))}
                        </div>
                    ) : (
                        <p className="barrierInspectionDetails__empty">
                            Nenhuma evidência registrada para esta inspeção.
                        </p>
                    )}
                </FormSection>
            </CardBox>
            <FormActions>
                <Button href={barrierUrls.show(barrier.id)} tone="cancel" label="Voltar" />
            </FormActions>
        </>
    );
}
