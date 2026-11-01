import { useRef, type ReactNode } from "react";
import { useForm } from "@inertiajs/react";
import FormActions from "@/components/Forms/FormActions/FormActions";
import FormField from "@/components/Forms/FormField/FormField";
import FormGrid, { FormGridWide } from "@/components/Forms/FormGrid/FormGrid";
import FormLayout from "@/components/Forms/FormLayout/FormLayout";
import FormSection from "@/components/Forms/FormSection/FormSection";
import TextArea from "@/components/Forms/TextArea/TextArea";
import TextInput from "@/components/Forms/TextInput/TextInput";
import BusinessPage from "@/components/Navigation/BusinessPage/BusinessPage";
import TeacherPortalLayout from "@/components/Navigation/TeacherPortalLayout/TeacherPortalLayout";
import Button from "@/components/UI/Button/Button";
import CardBox from "@/components/UI/CardBox/CardBox";
import { notify } from "@/components/UI/NotificationToast/notify";
import {
    teacherPortalBase,
    type TeacherPortalDisciplineEditProps,
} from "./TeacherPortal.types";
import "./TeacherPortal.css";

type DisciplineFormData = {
    specific_objectives: string;
    objectives_deadline: string;
    content_programmatic: string;
    curricular_reference: string;
    methodologies: string;
    materials_and_assistive_technology: string;
    evaluations: string;
    opinion: string;
    complementary_records: string;
};

/** Campos na ordem da tela do professor; o prazo é um texto curto, os demais são texto livre. */
const fields: Array<{
    name: keyof DisciplineFormData;
    label: string;
    required?: boolean;
    hint?: string;
    placeholder?: string;
    rows?: number;
    input?: boolean;
}> = [
    { name: "specific_objectives", label: "Objetivos Específicos", required: true },
    {
        name: "objectives_deadline",
        label: "Prazo das metas/objetivos",
        hint: "Opcional.",
        placeholder: "Ex.: até o fim do bimestre",
        input: true,
    },
    { name: "content_programmatic", label: "Conteúdo Programático", required: true },
    {
        name: "curricular_reference",
        label: "Referência curricular (BNCC ou ementa/unidade)",
        hint: "Opcional. No superior, use a ementa ou unidade curricular.",
        rows: 2,
    },
    { name: "methodologies", label: "Metodologias e Estratégias", required: true },
    {
        name: "materials_and_assistive_technology",
        label: "Recursos didáticos e tecnologia assistiva",
        hint: "Opcional. Preencha quando indicado para esta disciplina.",
        rows: 2,
    },
    { name: "evaluations", label: "Processo de Avaliação", required: true },
    { name: "opinion", label: "Parecer" },
    { name: "complementary_records", label: "Registros Complementares" },
];

export default function TeacherPortalDisciplineEditPage({
    peiDiscipline,
}: TeacherPortalDisciplineEditProps): React.JSX.Element {
    const busy = useRef(false);
    const element = useRef<HTMLFormElement>(null);
    const disciplineName = peiDiscipline.discipline_name ?? "Disciplina";
    const studentHref = `${teacherPortalBase}/alunos/${peiDiscipline.student_id}`;
    const form = useForm<DisciplineFormData>({
        specific_objectives: peiDiscipline.specific_objectives ?? "",
        objectives_deadline: peiDiscipline.objectives_deadline ?? "",
        content_programmatic: peiDiscipline.content_programmatic ?? "",
        curricular_reference: peiDiscipline.curricular_reference ?? "",
        methodologies: peiDiscipline.methodologies ?? "",
        materials_and_assistive_technology: peiDiscipline.materials_and_assistive_technology ?? "",
        evaluations: peiDiscipline.evaluations ?? "",
        opinion: peiDiscipline.opinion ?? "",
        complementary_records: peiDiscipline.complementary_records ?? "",
    });
    const errors = form.errors as Partial<Record<keyof DisciplineFormData, string>>;

    function describedBy(name: keyof DisciplineFormData, id: string, hint: boolean): string | undefined {
        return [hint ? `${id}-hint` : undefined, errors[name] ? `${id}-error` : undefined]
            .filter(Boolean)
            .join(" ") || undefined;
    }

    function submit(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        if (busy.current || form.processing) return;

        busy.current = true;
        form.put(`${teacherPortalBase}/adaptacoes/${peiDiscipline.id}`, {
            preserveScroll: true,
            onError: () => {
                window.requestAnimationFrame(() => {
                    element.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
                });
            },
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
                    text: "Não foi possível salvar a adaptação. Tente novamente.",
                });
                return false;
            },
            onFinish: () => {
                busy.current = false;
            },
        });
    }

    return (
        <BusinessPage
            title={disciplineName}
            subtitle={`Aluno: ${peiDiscipline.student_name}`}
            breadcrumbItems={[
                { label: "Portal do Professor", href: teacherPortalBase },
                { label: peiDiscipline.student_name, href: studentHref },
                { label: "Editar Adaptação" },
            ]}
            className="teacherPortal"
        >
            <FormLayout
                ref={element}
                aria-label={`Editar adaptação de ${disciplineName}`}
                aria-busy={form.processing}
                onSubmit={submit}
            >
                <CardBox>
                    <fieldset disabled={form.processing}>
                        <FormSection
                            id="teacher-portal-discipline-planning"
                            title="Planejamento Adaptado"
                            variant="inline"
                            iconClass="fa fa-book"
                        >
                            <FormGrid columns={2}>
                                {fields.map((field) => {
                                    const id = `teacher-portal-${field.name.replace(/_/g, "-")}`;
                                    const common = {
                                        id,
                                        name: field.name,
                                        required: field.required,
                                        placeholder: field.placeholder,
                                        value: form.data[field.name],
                                        "aria-invalid": !!errors[field.name] || undefined,
                                        "aria-describedby": describedBy(field.name, id, Boolean(field.hint)),
                                    };

                                    return (
                                        <FormGridWide key={field.name}>
                                            <FormField
                                                id={id}
                                                label={field.label}
                                                hint={field.hint}
                                                requiredIndicator={field.required}
                                                error={errors[field.name]}
                                            >
                                                {field.input ? (
                                                    <TextInput
                                                        {...common}
                                                        maxLength={255}
                                                        invalid={!!errors[field.name]}
                                                        onChange={(event) => form.setData(field.name, event.target.value)}
                                                    />
                                                ) : (
                                                    <TextArea
                                                        {...common}
                                                        rows={field.rows ?? 3}
                                                        onChange={(event) => form.setData(field.name, event.target.value)}
                                                    />
                                                )}
                                            </FormField>
                                        </FormGridWide>
                                    );
                                })}
                            </FormGrid>
                        </FormSection>
                    </fieldset>
                </CardBox>
                <FormActions status={form.processing ? "Salvando adaptação…" : undefined}>
                    <Button
                        href={teacherPortalBase}
                        tone="cancel"
                        label="Cancelar"
                        aria-label="Cancelar e voltar para meus alunos"
                        disabled={form.processing}
                    />
                    <Button
                        type="submit"
                        tone="save"
                        label="Salvar"
                        title="Salvar adaptação"
                        aria-label="Salvar adaptação"
                        disabled={form.processing}
                    />
                </FormActions>
            </FormLayout>
        </BusinessPage>
    );
}

TeacherPortalDisciplineEditPage.layout = (page: ReactNode): ReactNode => (
    <TeacherPortalLayout>{page}</TeacherPortalLayout>
);
