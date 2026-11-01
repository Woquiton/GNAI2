import FormSection from "@/components/Forms/FormSection/FormSection";
import PeiRichText from "./PeiRichText";
import type { PeiAttendanceSummary } from "./PeiShow.types";

/**
 * Atividades, acompanhamento e devolutivas do semestre (Portaria 421/2026,
 * art. 11, I/III/IV), reunidos dos atendimentos AEE e pedagógicos do aluno.
 */
export default function PeiAttendanceDetails({
    summary,
}: {
    summary: PeiAttendanceSummary;
}): React.JSX.Element {
    return (
        <FormSection
            id="pei-attendance"
            title="Atividades, Acompanhamento e Devolutivas do Semestre"
            iconClass="fa fa-calendar-check-o"
            variant="inline"
        >
            <p className="peiShow__note">
                Reunido automaticamente a partir dos atendimentos AEE e pedagógicos deste aluno dentro do semestre do PEI; não exige preenchimento aqui.
            </p>

            <h3 className="peiShow__timelineTitle">Atividades na SRM e em outros espaços do AEE</h3>
            {summary.activities.length ? (
                <ul className="peiShow__timeline">
                    {summary.activities.map((activity) => (
                        <li key={activity.id}>
                            <strong>{activity.date ?? "Sem data"}</strong>, {activity.professional ?? "—"}
                            <PeiRichText html={activity.text_html} />
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="peiShow__empty">Nenhum atendimento AEE registrado neste semestre.</p>
            )}

            <h3 className="peiShow__timelineTitle">Acompanhamento e Monitoramento</h3>
            {summary.monitoring.length ? (
                <ul className="peiShow__timeline">
                    {summary.monitoring.map((item) => (
                        <li key={item.id}>
                            <strong>{item.date ?? "Sem data"}</strong> ({item.source})
                            <PeiRichText html={item.text_html} />
                            {item.indicators_html ? (
                                <div>
                                    <small>Indicadores:</small>
                                    <PeiRichText html={item.indicators_html} />
                                </div>
                            ) : null}
                            {item.adjustments_html ? (
                                <div>
                                    <small>Ajustes:</small>
                                    <PeiRichText html={item.adjustments_html} />
                                </div>
                            ) : null}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="peiShow__empty">Nenhum acompanhamento registrado neste semestre.</p>
            )}

            <h3 className="peiShow__timelineTitle">Devolutivas às Famílias</h3>
            {summary.returns.length ? (
                <ul className="peiShow__timeline">
                    {summary.returns.map((item) => (
                        <li key={item.id}>
                            <strong>{item.date ?? "Sem data"}</strong>, {item.source}, {item.professional ?? "—"}
                            <br />
                            <small>Responsáveis presentes: {item.guardians ?? "—"}</small>
                            <PeiRichText html={item.summary_html} />
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="peiShow__empty">Nenhuma devolutiva à família registrada neste semestre.</p>
            )}
        </FormSection>
    );
}
