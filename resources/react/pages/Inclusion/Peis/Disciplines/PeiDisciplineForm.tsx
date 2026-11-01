import { useRef } from "react";
import { useForm } from "@inertiajs/react";
import BusinessPage from "@/components/Navigation/BusinessPage/BusinessPage";
import FormActions from "@/components/Forms/FormActions/FormActions";
import FormField from "@/components/Forms/FormField/FormField";
import FormGrid, { FormGridWide } from "@/components/Forms/FormGrid/FormGrid";
import FormLayout from "@/components/Forms/FormLayout/FormLayout";
import FormSection from "@/components/Forms/FormSection/FormSection";
import TextArea from "@/components/Forms/TextArea/TextArea";
import TextInput from "@/components/Forms/TextInput/TextInput";
import Button from "@/components/UI/Button/Button";
import CardBox from "@/components/UI/CardBox/CardBox";
import { notify } from "@/components/UI/NotificationToast/notify";

const aeeBase = "/inclusao";

export interface PeiDisciplineRecord {
    id: number;
    teacher_id: number;
    discipline_id: number;
    specific_objectives: string | null;
    content_programmatic: string | null;
    methodologies: string | null;
    evaluations: string | null;
    complementary_records: string | null;
    opinion: string | null;
    curricular_reference: string | null;
    materials_and_assistive_technology: string | null;
    objectives_deadline: string | null;
    teacher?: { person?: { name: string } | null } | null;
    discipline?: { name: string } | null;
}

type PeiDisciplineFormData = {
    teacher_id: string;
    discipline_id: string;
    specific_objectives: string;
    objectives_deadline: string;
    content_programmatic: string;
    curricular_reference: string;
    methodologies: string;
    materials_and_assistive_technology: string;
    evaluations: string;
    complementary_records: string;
    opinion: string;
};

type PeiDisciplineTextField = Exclude<keyof PeiDisciplineFormData, "teacher_id" | "discipline_id">;

/** `wide: false` coloca o campo em meia linha, ao lado do seguinte, como no Blade. */
const textFields: Array<{
    name: PeiDisciplineTextField;
    label: string;
    required: boolean;
    hint?: string;
    singleLine?: boolean;
    wide?: boolean;
}> = [
    {
        name: "specific_objectives",
        label: "Objetivos Específicos",
        required: true,
        wide: false,
    },
    {
        name: "objectives_deadline",
        label: "Prazo das metas/objetivos",
        required: false,
        singleLine: true,
        wide: false,
        hint: "Opcional. Ex.: \"até o fim do bimestre\", \"até dezembro/2026\".",
    },
    {
        name: "content_programmatic",
        label: "Conteúdo Programático",
        required: true,
        wide: false,
    },
    {
        name: "curricular_reference",
        label: "Referência curricular (BNCC ou ementa/unidade)",
        required: false,
        wide: false,
        hint: "Opcional. No superior, use a ementa ou unidade curricular correspondente.",
    },
    {
        name: "methodologies",
        label: "Metodologias e Estratégias",
        required: true,
        wide: false,
    },
    {
        name: "materials_and_assistive_technology",
        label: "Recursos didáticos e tecnologia assistiva",
        required: false,
        wide: false,
        hint: "Opcional. Preencha quando a disciplina exigir recurso específico (quando indicado).",
    },
    {
        name: "evaluations",
        label: "Processo de Avaliação",
        required: true,
    },
    {
        name: "complementary_records",
        label: "Registros Complementares",
        required: false,
        hint: "Espaço opcional destinado ao registro de informações relevantes que contribuam para o acompanhamento pedagógico do estudante e que não estejam contempladas nos campos anteriores.",
    },
    {
        name: "opinion",
        label: "Parecer",
        required: false,
    },
];

/**
 * Edição do planejamento de uma adaptação. A criação é feita em lote
 * (Disciplines/Create), só com disciplina e professor responsável.
 */
export default function PeiDisciplineForm({
    pei,
    peiDiscipline,
}: {
    pei: { id: number };
    peiDiscipline: PeiDisciplineRecord;
}): React.JSX.Element {
    const busy = useRef(false);
    const element = useRef<HTMLFormElement>(null);
    const peiHref = `${aeeBase}/peis/${pei.id}/visualizar?tab=disciplines`;
    const form = useForm<PeiDisciplineFormData>({
        teacher_id: String(peiDiscipline.teacher_id),
        discipline_id: String(peiDiscipline.discipline_id),
        specific_objectives: peiDiscipline.specific_objectives ?? "",
        objectives_deadline: peiDiscipline.objectives_deadline ?? "",
        content_programmatic: peiDiscipline.content_programmatic ?? "",
        curricular_reference: peiDiscipline.curricular_reference ?? "",
        methodologies: peiDiscipline.methodologies ?? "",
        materials_and_assistive_technology: peiDiscipline.materials_and_assistive_technology ?? "",
        evaluations: peiDiscipline.evaluations ?? "",
        complementary_records: peiDiscipline.complementary_records ?? "",
        opinion: peiDiscipline.opinion ?? "",
    });
    const errors = form.errors as Record<string, string | undefined>;
    const describedBy = (name: string, id: string, hint = false): string | undefined =>
        [hint ? `${id}-hint` : undefined, errors[name] ? `${id}-error` : undefined]
            .filter(Boolean)
            .join(" ") || undefined;
    function focusFirstError(): void {
        window.requestAnimationFrame(() => {
            element.current
                ?.querySelector<HTMLElement>("[aria-invalid='true']")
                ?.focus();
        });
    }

    function submit(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        if (busy.current || form.processing) return;

        busy.current = true;
        const options = {
            preserveScroll: true,
            onError: focusFirstError,
            onNetworkError: () => {
                notify({
                    tone: "error",
                    title: "Falha de conexão",
                    text: "Não foi possível conectar ao servidor. Confira sua conexão e tente novamente.",
                });
                return false;
            },
            onHttpException: () => {
                notify({
                    tone: "error",
                    title: "Não foi possível concluir",
                    text: "Não foi possível salvar a adaptação curricular. Tente novamente.",
                });
                return false;
            },
            onFinish: () => {
                busy.current = false;
            },
        };

        form.put(`${aeeBase}/peis/${pei.id}/disciplinas/${peiDiscipline.id}`, options);
    }

    const disciplineName = peiDiscipline.discipline?.name ?? "";

    return (
        <BusinessPage
            title="Editar Adaptação Curricular"
            subtitle={`Atualize o planejamento pedagógico para a disciplina de ${disciplineName}.`}
            breadcrumbItems={[
                { label: "Home", href: "/autenticacao/painel" },
                { label: "Alunos", href: `${aeeBase}/alunos` },
                { label: "PEI", href: peiHref },
                { label: "Editar Adaptação" },
            ]}
            className="peiDisciplineFormPage"
        >
            <FormLayout
                ref={element}
                aria-label="Editar adaptação curricular"
                aria-busy={form.processing}
                onSubmit={submit}
            >
                <CardBox>
                    <fieldset disabled={form.processing}>
                        <FormSection
                            id="pei-discipline-identification"
                            title="Identificação (Somente Leitura)"
                            variant="inline"
                            iconClass="fa fa-graduation-cap"
                        >
                            <FormGrid columns={2}>
                                <FormField
                                    id="pei-discipline-teacher"
                                    label="Professor Responsável"
                                    error={errors.teacher_id}
                                >
                                    <TextInput
                                        id="pei-discipline-teacher"
                                        name="teacher_display"
                                        value={peiDiscipline.teacher?.person?.name ?? ""}
                                        disabled
                                        readOnly
                                        invalid={!!errors.teacher_id}
                                        aria-describedby={describedBy("teacher_id", "pei-discipline-teacher")}
                                    />
                                </FormField>
                                <FormField
                                    id="pei-discipline-discipline"
                                    label="Disciplina"
                                    error={errors.discipline_id}
                                >
                                    <TextInput
                                        id="pei-discipline-discipline"
                                        name="discipline_display"
                                        value={disciplineName}
                                        disabled
                                        readOnly
                                        invalid={!!errors.discipline_id}
                                        aria-describedby={describedBy("discipline_id", "pei-discipline-discipline")}
                                    />
                                </FormField>
                            </FormGrid>
                        </FormSection>
                        <FormSection
                            id="pei-discipline-planning"
                            title="Planejamento Adaptado"
                            variant="inline"
                            iconClass="fa fa-book"
                        >
                            <FormGrid columns={2}>
                                {textFields.map((field) => {
                                    const id = `pei-discipline-${field.name.replace(/_/g, "-")}`;
                                    const control = field.singleLine ? (
                                        <TextInput
                                            id={id}
                                            name={field.name}
                                            maxLength={255}
                                            value={form.data[field.name]}
                                            invalid={!!errors[field.name]}
                                            aria-describedby={describedBy(field.name, id, Boolean(field.hint))}
                                            onChange={(event) => form.setData(field.name, event.target.value)}
                                        />
                                    ) : (
                                        <TextArea
                                            id={id}
                                            name={field.name}
                                            rows={4}
                                            required={field.required}
                                            value={form.data[field.name]}
                                            aria-invalid={!!errors[field.name] || undefined}
                                            aria-describedby={describedBy(field.name, id, Boolean(field.hint))}
                                            onChange={(event) => form.setData(field.name, event.target.value)}
                                        />
                                    );
                                    const formField = (
                                        <FormField
                                            key={field.name}
                                            id={id}
                                            label={field.label}
                                            hint={field.hint}
                                            requiredIndicator={field.required}
                                            error={errors[field.name]}
                                        >
                                            {control}
                                        </FormField>
                                    );

                                    return field.wide === false
                                        ? formField
                                        : <FormGridWide key={field.name}>{formField}</FormGridWide>;
                                })}
                            </FormGrid>
                        </FormSection>
                    </fieldset>
                </CardBox>
                <FormActions
                    status={form.processing ? "Salvando alterações…" : undefined}
                >
                    <Button
                        href={peiHref}
                        tone="cancel"
                        label="Cancelar"
                        aria-label="Cancelar e voltar ao PEI"
                        disabled={form.processing}
                    />
                    <Button
                        type="submit"
                        tone="save"
                        label="Salvar"
                        title="Atualizar adaptação"
                        aria-label="Atualizar adaptação"
                        disabled={form.processing}
                    />
                </FormActions>
            </FormLayout>
        </BusinessPage>
    );
}
