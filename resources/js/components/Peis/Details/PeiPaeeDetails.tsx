import FormSection from '@/components/Forms/FormSection/FormSection';
import { paeeUrls } from '@/components/Paees/Paees.routes';
import Button from '@/components/UI/Button/Button';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import RichTextContent from '@/components/UI/RichTextContent/RichTextContent';
import type { PeiPaeeSummary } from '../Peis.types';
import PeiSectionActions from './PeiSectionActions';
import EmptyText from '@/components/UI/EmptyText/EmptyText';
import { PEI_TOUR_TARGETS } from '../peiTours';

interface PeiPaeeDetailsProps {
    paee: PeiPaeeSummary | null;
}

function PaeeSummary({ paee }: { paee: PeiPaeeSummary }): React.JSX.Element {
    return (
        <>
            <DetailGrid columns={4}>
                <DetailField label="Versão">v{paee.version ?? '—'}</DetailField>
                <DetailField label="Status">{paee.status_label}</DetailField>
                <DetailField label="Frequência semanal">
                    {paee.attendance_frequency_per_week ?? '—'}
                </DetailField>
                <DetailField label="Duração (min)">
                    {paee.attendance_duration_minutes ?? '—'}
                </DetailField>
                <DetailField label="Formato de atendimento">
                    {paee.attendance_format_label}
                </DetailField>
                <DetailField label="Local de atendimento">
                    {paee.attendance_location_label}
                </DetailField>
                <DetailField label="Articulação com o professor regente" wide>
                    <RichTextContent html={paee.common_teachers_articulation_html} />
                </DetailField>
            </DetailGrid>
            <PeiSectionActions>
                <Button
                    href={paeeUrls.show(paee.id)}
                    tone="info"
                    leftIconClass="fa fa-external-link"
                    label="Ver PAEE completo"
                    title="Ver PAEE completo"
                    aria-label="Ver PAEE completo"
                />
            </PeiSectionActions>
        </>
    );
}

/** PAEE vinculado ao PEI, no lugar do antigo contexto do estudante. */
export default function PeiPaeeDetails({ paee }: PeiPaeeDetailsProps): React.JSX.Element {
    return (
        <FormSection
            id="pei-paee"
            tourTarget={PEI_TOUR_TARGETS.paee}
            title="PAEE Vinculado"
            iconClass="fa fa-sitemap"
            variant="inline"
        >
            {paee ? (
                <PaeeSummary paee={paee} />
            ) : (
                <EmptyText>Nenhum PAEE vinculado a este PEI.</EmptyText>
            )}
        </FormSection>
    );
}
