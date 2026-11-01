import FormSection from "@/components/Forms/FormSection/FormSection";
import { aeeBase } from "@/components/Students/Students.utils";
import Button from "@/components/UI/Button/Button";
import DetailField from "@/components/UI/DetailField/DetailField";
import PeiRichText from "./PeiRichText";
import type { PeiPaeeSummary } from "./PeiShow.types";

/** PAEE vinculado ao PEI, no lugar do antigo contexto do estudante. */
export default function PeiPaeeDetails({
    paee,
}: {
    paee: PeiPaeeSummary | null;
}): React.JSX.Element {
    return (
        <FormSection
            id="pei-paee"
            title="PAEE Vinculado"
            iconClass="fa fa-sitemap"
            variant="inline"
        >
            {paee ? (
                <>
                    <dl className="peiShow__grid peiShow__grid--4">
                        <DetailField label="Versão">
                            <strong>v{paee.version ?? "—"}</strong>
                        </DetailField>
                        <DetailField label="Status">{paee.status_label}</DetailField>
                        <DetailField label="Frequência semanal">
                            {paee.attendance_frequency_per_week ?? "—"}
                        </DetailField>
                        <DetailField label="Duração (min)">
                            {paee.attendance_duration_minutes ?? "—"}
                        </DetailField>
                        <DetailField label="Formato de atendimento">
                            {paee.attendance_format_label}
                        </DetailField>
                        <DetailField label="Local de atendimento">
                            {paee.attendance_location_label}
                        </DetailField>
                        <DetailField label="Articulação com o professor regente" wide>
                            <PeiRichText html={paee.common_teachers_articulation_html} />
                        </DetailField>
                    </dl>
                    <div className="peiShow__inlineFormActions">
                        <Button
                            href={`${aeeBase}/paees/${paee.id}/visualizar`}
                            tone="info"
                            leftIconClass="fa fa-external-link"
                            label="Ver PAEE completo"
                            title="Ver PAEE completo"
                            aria-label="Ver PAEE completo"
                        />
                    </div>
                </>
            ) : (
                <p className="peiShow__empty">Nenhum PAEE vinculado a este PEI.</p>
            )}
        </FormSection>
    );
}
