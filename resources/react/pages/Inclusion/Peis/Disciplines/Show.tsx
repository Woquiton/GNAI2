import { useRef } from "react";
import { useForm } from "@inertiajs/react";
import FormActions from "@/components/Forms/FormActions/FormActions";
import FormField from "@/components/Forms/FormField/FormField";
import FormGrid from "@/components/Forms/FormGrid/FormGrid";
import FormLayout from "@/components/Forms/FormLayout/FormLayout";
import FormSection from "@/components/Forms/FormSection/FormSection";
import TextArea from "@/components/Forms/TextArea/TextArea";
import BusinessPage from "@/components/Navigation/BusinessPage/BusinessPage";
import {
    aeeBase,
    studentUrl,
    studentsBase,
} from "@/components/Students/Students.utils";
import Button from "@/components/UI/Button/Button";
import CardBox from "@/components/UI/CardBox/CardBox";
import DetailField from "@/components/UI/DetailField/DetailField";
import { notify } from "@/components/UI/NotificationToast/notify";
import PeiConfirmAction from "@/pages/Inclusion/Peis/PeiConfirmAction";
import PeiRichText from "@/pages/Inclusion/Peis/PeiRichText";
import type {
    PeiDisciplineDetails,
    PeiDisciplineRevision,
    PeiDisciplineShowProps,
} from "@/pages/Inclusion/Peis/PeiShow.types";
import "@/components/Students/Students.css";
import "@/pages/Inclusion/Peis/PeiShow.css";

type DetailHtmlField = keyof Omit<PeiDisciplineDetails, "id" | "discipline_name" | "teacher_name">;

/** `wide: false` mostra o campo em meia linha, ao lado do seguinte, como no Blade. */
const fields: Array<{ name: DetailHtmlField; label: string; wide?: boolean }> = [
    { name: "specific_objectives_html", label: "Objetivos Específicos", wide: false },
    { name: "objectives_deadline_html", label: "Prazo das metas/objetivos", wide: false },
    { name: "content_programmatic_html", label: "Conteúdo Programático", wide: false },
    { name: "curricular_reference_html", label: "Referência curricular", wide: false },
    { name: "methodologies_html", label: "Metodologias e Estratégias", wide: false },
    { name: "materials_and_assistive_technology_html", label: "Recursos didáticos e tecnologia assistiva", wide: false },
    { name: "evaluations_html", label: "Processo de Avaliação" },
    { name: "complementary_records_html", label: "Registros Complementares" },
    { name: "opinion_html", label: "Parecer" },
];

function DisciplineRevisions({
    action,
    revisions,
    canAdd,
}: {
    action: string;
    revisions: PeiDisciplineRevision[];
    canAdd: boolean;
}): React.JSX.Element {
    const busy = useRef(false);
    const form = useForm({ what_changed: "", why: "" });

    function submit(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        if (busy.current || form.processing) return;

        busy.current = true;
        form.post(action, {
            preserveScroll: true,
            onSuccess: () => form.reset(),
            onNetworkError: () => {
                notify({
                    tone: "error",
                    title: "Falha de conexão",
                    text: "Não foi possível conectar ao servidor. Confira sua conexão e tente novamente.",
                });
                return false;
            },
            onFinish: () => {
                busy.current = false;
            },
        });
    }

    return (
        <FormSection
            id="pei-discipline-revisions"
            title="Revisões desta Adaptação"
            iconClass="fa fa-history"
            variant="inline"
        >
            {revisions.length ? (
                <ul className="peiShow__timeline">
                    {revisions.map((revision) => (
                        <li key={revision.id}>
                            <strong>{revision.reviewed_at ?? "Sem data"}</strong>
                            {revision.reviewer_name ? `, ${revision.reviewer_name}` : null}
                            <p>{revision.what_changed}</p>
                            <small>{revision.why}</small>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="peiShow__empty">Nenhuma revisão registrada para esta disciplina.</p>
            )}
            {canAdd ? (
                <FormLayout
                    className="peiShow__inlineForm"
                    aria-label="Registrar revisão da adaptação"
                    aria-busy={form.processing}
                    onSubmit={submit}
                >
                    <FormGrid columns={2}>
                        <FormField
                            id="revision-what-changed"
                            label="O que mudou"
                            requiredIndicator
                            error={form.errors.what_changed}
                        >
                            <TextArea
                                id="revision-what-changed"
                                name="what_changed"
                                rows={2}
                                required
                                placeholder="Ex.: Metodologia alterada para incluir apoio visual nas atividades."
                                value={form.data.what_changed}
                                aria-invalid={!!form.errors.what_changed || undefined}
                                aria-describedby={form.errors.what_changed ? "revision-what-changed-error" : undefined}
                                disabled={form.processing}
                                onChange={(event) => form.setData("what_changed", event.target.value)}
                            />
                        </FormField>
                        <FormField
                            id="revision-why"
                            label="Por quê"
                            requiredIndicator
                            error={form.errors.why}
                        >
                            <TextArea
                                id="revision-why"
                                name="why"
                                rows={2}
                                required
                                placeholder="Ex.: Professor observou melhor engajamento do aluno com recursos visuais."
                                value={form.data.why}
                                aria-invalid={!!form.errors.why || undefined}
                                aria-describedby={form.errors.why ? "revision-why-error" : undefined}
                                disabled={form.processing}
                                onChange={(event) => form.setData("why", event.target.value)}
                            />
                        </FormField>
                    </FormGrid>
                    <div className="peiShow__inlineFormActions">
                        <Button
                            type="submit"
                            tone="save"
                            leftIconClass="fa fa-plus"
                            label={form.processing ? "Registrando..." : "Registrar"}
                            title="Registrar revisão"
                            aria-label="Registrar revisão"
                            disabled={form.processing}
                        />
                    </div>
                </FormLayout>
            ) : null}
        </FormSection>
    );
}

export default function InclusionPeisDisciplinesShowPage({
    pei,
    student,
    peiDiscipline,
    revisions,
    can,
}: PeiDisciplineShowProps): React.JSX.Element {
    const peiUrl = `${aeeBase}/peis/${pei.id}`;
    const disciplineUrl = `${peiUrl}/disciplinas/${peiDiscipline.id}`;
    const disciplineName = peiDiscipline.discipline_name || "Não informado";

    return (
        <BusinessPage
            title={`Planejamento da Disciplina ${disciplineName}`}
            subtitle={`Visualize a adaptação para a disciplina ${disciplineName}.`}
            breadcrumbItems={[
                { label: "Home", href: "/autenticacao/painel" },
                { label: "Alunos", href: studentsBase },
                { label: student.name, href: studentUrl(student.id) },
                { label: `PEI #${pei.id}`, href: `${peiUrl}/visualizar?tab=disciplines` },
                { label: disciplineName },
            ]}
            className="studentsPage peiShow"
        >
            <CardBox>
                <FormSection
                    id="pei-discipline-details"
                    title="Adaptações Razoáveis e/ou Acessibilidades Curriculares"
                    iconClass="fa fa-book"
                    variant="inline"
                >
                    <dl className="peiShow__grid">
                        {fields.map((field) => (
                            <DetailField
                                key={field.name}
                                label={field.label}
                                wide={field.wide !== false}
                            >
                                <PeiRichText html={peiDiscipline[field.name]} />
                            </DetailField>
                        ))}
                    </dl>
                </FormSection>
                <DisciplineRevisions
                    action={`${disciplineUrl}/revisoes`}
                    revisions={revisions}
                    canAdd={can.addRevision}
                />
            </CardBox>
            <FormActions
                secondary={can.pdf ? (
                    <Button
                        href={`${peiUrl}/disciplinas/${peiDiscipline.id}/pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        tone="dark-red"
                        leftIconClass="fa fa-file-pdf-o"
                        label="PDF"
                        title="Gerar PDF da adaptação"
                        aria-label="Gerar PDF da adaptação"
                    />
                ) : undefined}
            >
                <Button
                    href={`${peiUrl}/visualizar?tab=disciplines`}
                    tone="cancel"
                    label="Voltar"
                    title="Voltar para o PEI"
                    aria-label="Voltar para o PEI"
                />
                {can.update ? (
                    <Button
                        href={`${disciplineUrl}/editar`}
                        tone="warning"
                        leftIconClass="fa fa-pencil"
                        label="Editar"
                        title="Editar adaptação"
                        aria-label="Editar adaptação"
                    />
                ) : null}
                {can.delete ? (
                    <PeiConfirmAction
                        method="delete"
                        action={disciplineUrl}
                        label="Excluir"
                        ariaLabel="Excluir adaptação"
                        tone="dark-red"
                        iconClass="fa fa-trash-o"
                        modalTitle="Excluir Adaptação"
                        message="Deseja realmente excluir esta adaptação?"
                        confirmLabel="Confirmar exclusão"
                        processingLabel="Excluindo adaptação..."
                    />
                ) : null}
            </FormActions>
        </BusinessPage>
    );
}
