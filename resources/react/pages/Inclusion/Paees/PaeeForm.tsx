import { useRef } from "react";
import { useForm } from "@inertiajs/react";
import FormActions from "@/components/Forms/FormActions/FormActions";
import FormField from "@/components/Forms/FormField/FormField";
import FormGrid, { FormGridWide } from "@/components/Forms/FormGrid/FormGrid";
import FormLayout from "@/components/Forms/FormLayout/FormLayout";
import FormSection from "@/components/Forms/FormSection/FormSection";
import RepeaterField from "@/components/Forms/RepeaterField/RepeaterField";
import SelectField from "@/components/Forms/SelectField/SelectField";
import TextArea from "@/components/Forms/TextArea/TextArea";
import TextInput from "@/components/Forms/TextInput/TextInput";
import ToggleControl from "@/components/Forms/ToggleControl/ToggleControl";
import Button from "@/components/UI/Button/Button";
import CardBox from "@/components/UI/CardBox/CardBox";
import { notify } from "@/components/UI/NotificationToast/notify";
import type {
    PaeeEditRecord,
    PaeeFormData,
    PaeeObjectiveInput,
    PaeeResourceInput,
} from "./Paees.types";
import {
    acquisitionTypeOptions,
    attendanceFormatOptions,
    attendanceLocationOptions,
    objectiveTermOptions,
    paeeUrl,
    paeesBase,
} from "./Paees.utils";
import "./Paees.css";

type BooleanField =
    | "assistive_technology_needed"
    | "caa_needed"
    | "is_assistive_technology_portable_digital_device"
    | "support_professional_needed"
    | "libras_interpreter_needed"
    | "guide_interpreter_needed";

type TextField = Exclude<
    keyof PaeeFormData,
    BooleanField | "objectives" | "resources" | "attendance_frequency_per_week" | "attendance_duration_minutes" | "attendance_format" | "attendance_location"
>;

function initialData(paee?: PaeeEditRecord): PaeeFormData {
    return {
        attendance_frequency_per_week: paee?.attendance_frequency_per_week == null ? "" : String(paee.attendance_frequency_per_week),
        attendance_duration_minutes: paee?.attendance_duration_minutes == null ? "" : String(paee.attendance_duration_minutes),
        attendance_format: paee?.attendance_format ?? "",
        attendance_location: paee?.attendance_location ?? "",
        assistive_technology_needed: paee?.assistive_technology_needed ?? false,
        assistive_technology_notes: paee?.assistive_technology_notes ?? "",
        assistive_technology_availability_capacity: paee?.assistive_technology_availability_capacity ?? "",
        caa_needed: paee?.caa_needed ?? false,
        caa_notes: paee?.caa_notes ?? "",
        is_assistive_technology_portable_digital_device: paee?.is_assistive_technology_portable_digital_device ?? false,
        assistive_technology_pedagogical_opinion: paee?.assistive_technology_pedagogical_opinion ?? "",
        support_professional_needed: paee?.support_professional_needed ?? false,
        support_professional_justification: paee?.support_professional_justification ?? "",
        libras_interpreter_needed: paee?.libras_interpreter_needed ?? false,
        libras_interpreter_justification: paee?.libras_interpreter_justification ?? "",
        guide_interpreter_needed: paee?.guide_interpreter_needed ?? false,
        guide_interpreter_justification: paee?.guide_interpreter_justification ?? "",
        school_professionals_orientation: paee?.school_professionals_orientation ?? "",
        common_teachers_articulation: paee?.common_teachers_articulation ?? "",
        family_articulation: paee?.family_articulation ?? "",
        intersectoral_articulation: paee?.intersectoral_articulation ?? "",
        training_demands: paee?.training_demands ?? "",
        objectives: paee?.objectives.map((objective) => ({ ...objective })) ?? [],
        resources: paee?.resources.map((resource) => ({ ...resource })) ?? [],
    };
}

/* Os selects do Blade não tinham opção vazia: o bloco novo começa na primeira opção. */
const newObjective = (): PaeeObjectiveInput => ({
    description: "",
    term: objectiveTermOptions[0].value,
    linked_barrier_id: null,
});
const newResource = (): PaeeResourceInput => ({
    description: "",
    acquisition_type: acquisitionTypeOptions[0].value,
    assistive_technology_id: null,
});

const articulationFields: Array<{ name: TextField; label: string; hint?: string; wide?: boolean }> = [
    { name: "school_professionals_orientation", label: "Orientação aos profissionais da escola" },
    { name: "common_teachers_articulation", label: "Articulação com professores do ensino comum" },
    {
        name: "family_articulation",
        label: "Como a família será envolvida",
        hint: "Planeje a forma de contato e o que será combinado com a família.",
    },
    { name: "intersectoral_articulation", label: "Articulação intersetorial" },
    { name: "training_demands", label: "Demandas de formação", wide: true },
];

const supportFields: Array<{ toggle: BooleanField; toggleLabel: string; text: TextField; textLabel: string }> = [
    {
        toggle: "support_professional_needed",
        toggleLabel: "Necessita de profissional de apoio",
        text: "support_professional_justification",
        textLabel: "Justificativa do profissional de apoio",
    },
    {
        toggle: "libras_interpreter_needed",
        toggleLabel: "Necessita de tradutor/intérprete de Libras",
        text: "libras_interpreter_justification",
        textLabel: "Justificativa do intérprete de Libras",
    },
    {
        toggle: "guide_interpreter_needed",
        toggleLabel: "Necessita de guia-intérprete",
        text: "guide_interpreter_justification",
        textLabel: "Justificativa do guia-intérprete",
    },
];

const fieldId = (name: string): string => `paee-${name.replace(/[._]/g, "-")}`;

export default function PaeeForm({
    caseStudyId,
    paee,
    cancelHref,
}: {
    /** Cadastro: Estudo de Caso de origem, enviado como `case_study_id`. */
    caseStudyId?: number;
    /** Edição: PAEE existente. */
    paee?: PaeeEditRecord;
    cancelHref: string;
}): React.JSX.Element {
    const editing = Boolean(paee);
    const busy = useRef(false);
    const element = useRef<HTMLFormElement>(null);
    const form = useForm<PaeeFormData>(initialData(paee));
    const errors = form.errors as Record<string, string | undefined>;
    const disabled = form.processing;

    const describedBy = (name: string, hint = false): string | undefined =>
        [hint ? `${fieldId(name)}-hint` : undefined, errors[name] ? `${fieldId(name)}-error` : undefined]
            .filter(Boolean)
            .join(" ") || undefined;

    function textArea(name: TextField, label: string, options: { hint?: string; required?: boolean; rows?: number } = {}): React.JSX.Element {
        const id = fieldId(name);

        return (
            <FormField
                id={id}
                label={label}
                hint={options.hint}
                requiredIndicator={options.required}
                error={errors[name]}
            >
                <TextArea
                    id={id}
                    name={name}
                    rows={options.rows ?? 2}
                    value={form.data[name]}
                    aria-invalid={Boolean(errors[name]) || undefined}
                    aria-describedby={describedBy(name, Boolean(options.hint))}
                    onChange={(event) => form.setData(name, event.target.value)}
                />
            </FormField>
        );
    }

    function toggle(name: BooleanField, label: string, description?: string): React.JSX.Element {
        return (
            <ToggleControl
                id={fieldId(name)}
                name={name}
                size="small"
                label={label}
                description={errors[name] ?? description}
                checked={form.data[name]}
                disabled={disabled}
                onChange={(checked) => form.setData(name, checked)}
            />
        );
    }

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
                    text: "Não foi possível salvar o PAEE. Tente novamente.",
                });
                return false;
            },
            onFinish: () => {
                busy.current = false;
            },
        };

        if (paee) {
            form.put(paeeUrl(paee.id, ""), options);
        } else {
            form.transform((data) => ({ ...data, case_study_id: caseStudyId }));
            form.post(`${paeesBase}/store`, options);
        }
    }

    return (
        <FormLayout
            ref={element}
            aria-label={editing ? "Editar PAEE" : "Cadastrar PAEE"}
            aria-busy={form.processing}
            onSubmit={submit}
        >
            <CardBox>
                <fieldset disabled={disabled}>
                    <FormSection
                        id="paee-attendance"
                        title="Caracterização do Atendimento"
                        variant="inline"
                        iconClass="fa fa-calendar-check-o"
                    >
                        <FormGrid columns={4}>
                            <FormField
                                id={fieldId("attendance_frequency_per_week")}
                                label="Frequência semanal"
                                requiredIndicator
                                error={errors.attendance_frequency_per_week}
                            >
                                <TextInput
                                    id={fieldId("attendance_frequency_per_week")}
                                    name="attendance_frequency_per_week"
                                    type="number"
                                    min={1}
                                    max={7}
                                    required
                                    value={form.data.attendance_frequency_per_week}
                                    invalid={Boolean(errors.attendance_frequency_per_week)}
                                    aria-describedby={describedBy("attendance_frequency_per_week")}
                                    onChange={(event) => form.setData("attendance_frequency_per_week", event.target.value)}
                                />
                            </FormField>
                            <FormField
                                id={fieldId("attendance_duration_minutes")}
                                label="Duração (minutos)"
                                requiredIndicator
                                error={errors.attendance_duration_minutes}
                            >
                                <TextInput
                                    id={fieldId("attendance_duration_minutes")}
                                    name="attendance_duration_minutes"
                                    type="number"
                                    min={1}
                                    required
                                    value={form.data.attendance_duration_minutes}
                                    invalid={Boolean(errors.attendance_duration_minutes)}
                                    aria-describedby={describedBy("attendance_duration_minutes")}
                                    onChange={(event) => form.setData("attendance_duration_minutes", event.target.value)}
                                />
                            </FormField>
                            <FormField
                                id={fieldId("attendance_format")}
                                label="Formato do atendimento"
                                requiredIndicator
                                error={errors.attendance_format}
                            >
                                <SelectField
                                    id={fieldId("attendance_format")}
                                    name="attendance_format"
                                    label="Formato do atendimento"
                                    required
                                    value={form.data.attendance_format}
                                    options={attendanceFormatOptions}
                                    disabled={disabled}
                                    aria-invalid={Boolean(errors.attendance_format)}
                                    aria-describedby={describedBy("attendance_format")}
                                    onChange={(event) => form.setData("attendance_format", event.target.value)}
                                />
                            </FormField>
                            <FormField
                                id={fieldId("attendance_location")}
                                label="Local do atendimento"
                                requiredIndicator
                                error={errors.attendance_location}
                            >
                                <SelectField
                                    id={fieldId("attendance_location")}
                                    name="attendance_location"
                                    label="Local do atendimento"
                                    required
                                    value={form.data.attendance_location}
                                    options={attendanceLocationOptions}
                                    disabled={disabled}
                                    aria-invalid={Boolean(errors.attendance_location)}
                                    aria-describedby={describedBy("attendance_location")}
                                    onChange={(event) => form.setData("attendance_location", event.target.value)}
                                />
                            </FormField>
                        </FormGrid>
                    </FormSection>

                    <FormSection
                        id="paee-assistive-technology"
                        title="Tecnologia Assistiva e Comunicação Aumentativa e Alternativa (CAA)"
                        variant="inline"
                        iconClass="fa fa-wheelchair"
                    >
                        <FormGrid columns={2}>
                            {toggle("assistive_technology_needed", "Necessita de tecnologia assistiva")}
                            {toggle("caa_needed", "Necessita de Comunicação Aumentativa e Alternativa (CAA)")}
                            {textArea("assistive_technology_notes", "Observações sobre tecnologia assistiva", {
                                required: form.data.assistive_technology_needed,
                            })}
                            {textArea("caa_notes", "Observações sobre CAA", {
                                required: form.data.caa_needed,
                            })}
                            <FormGridWide>
                                {textArea("assistive_technology_availability_capacity", "Capacidade de disponibilização da TA", {
                                    hint: "Avalie se a escola tem condições de disponibilizar a tecnologia assistiva indicada (equipamento próprio, empréstimo, aquisição etc.).",
                                })}
                            </FormGridWide>
                            {toggle(
                                "is_assistive_technology_portable_digital_device",
                                "A tecnologia assistiva é um dispositivo digital portátil",
                                "Marque se a TA indicada for um dispositivo digital portátil (tablet, notebook etc.); exige parecer pedagógico ao lado.",
                            )}
                            {textArea("assistive_technology_pedagogical_opinion", "Parecer pedagógico sobre a TA portátil", {
                                required: form.data.is_assistive_technology_portable_digital_device,
                            })}
                        </FormGrid>
                    </FormSection>

                    <FormSection
                        id="paee-supports"
                        title="Apoios de Profissionais"
                        description="A necessidade de cada apoio é avaliada a partir do Estudo de Caso, sem exigir laudo médico."
                        variant="inline"
                        iconClass="fa fa-users"
                    >
                        <FormGrid columns={3}>
                            {supportFields.map((field) => (
                                <div key={field.toggle}>
                                    {toggle(field.toggle, field.toggleLabel)}
                                </div>
                            ))}
                            {supportFields.map((field) => (
                                <div key={field.text}>
                                    {textArea(field.text, field.textLabel, {
                                        required: form.data[field.toggle],
                                    })}
                                </div>
                            ))}
                        </FormGrid>
                    </FormSection>

                    <FormSection
                        id="paee-objectives"
                        title="Objetivos"
                        variant="inline"
                        iconClass="fa fa-bullseye"
                    >
                        <RepeaterField<PaeeObjectiveInput>
                            items={form.data.objectives}
                            onChange={(objectives) => form.setData("objectives", objectives)}
                            createItem={newObjective}
                            itemLabel={(index) => `Objetivo ${index + 1}`}
                            addLabel="Objetivo"
                            emptyMessage="Nenhum objetivo adicionado."
                            disabled={disabled}
                            renderItem={(objective, index, update) => {
                                const description = `objectives.${index}.description`;
                                const term = `objectives.${index}.term`;

                                return (
                                    <div className="paeeForm__item paeeForm__item--objective">
                                        <div>
                                            <FormField
                                                id={fieldId(description)}
                                                label="Descrição"
                                                requiredIndicator
                                                error={errors[description]}
                                            >
                                                <TextArea
                                                    id={fieldId(description)}
                                                    name={`objectives[${index}][description]`}
                                                    rows={2}
                                                    value={objective.description}
                                                    aria-invalid={Boolean(errors[description]) || undefined}
                                                    aria-describedby={describedBy(description)}
                                                    onChange={(event) => update({ description: event.target.value })}
                                                />
                                            </FormField>
                                        </div>
                                        <FormField
                                            id={fieldId(term)}
                                            label="Prazo"
                                            requiredIndicator
                                            error={errors[term]}
                                        >
                                            <SelectField
                                                id={fieldId(term)}
                                                name={`objectives[${index}][term]`}
                                                label="Prazo"
                                                required
                                                value={objective.term}
                                                options={objectiveTermOptions}
                                                disabled={disabled}
                                                aria-invalid={Boolean(errors[term])}
                                                aria-describedby={describedBy(term)}
                                                onChange={(event) => update({ term: event.target.value })}
                                            />
                                        </FormField>
                                    </div>
                                );
                            }}
                        />
                    </FormSection>

                    <FormSection
                        id="paee-resources"
                        title="Recursos"
                        description="Se não houver necessidade de nenhum recurso ou material, deixe a lista vazia."
                        variant="inline"
                        iconClass="fa fa-cubes"
                    >
                        <RepeaterField<PaeeResourceInput>
                            items={form.data.resources}
                            onChange={(resources) => form.setData("resources", resources)}
                            createItem={newResource}
                            itemLabel={(index) => `Recurso ${index + 1}`}
                            addLabel="Recurso"
                            emptyMessage="Nenhum recurso adicionado."
                            disabled={disabled}
                            renderItem={(resource, index, update) => {
                                const description = `resources.${index}.description`;
                                const acquisition = `resources.${index}.acquisition_type`;

                                return (
                                    <div className="paeeForm__item paeeForm__item--resource">
                                        <div>
                                            <FormField
                                                id={fieldId(description)}
                                                label="Descrição"
                                                requiredIndicator
                                                error={errors[description]}
                                            >
                                                <TextArea
                                                    id={fieldId(description)}
                                                    name={`resources[${index}][description]`}
                                                    rows={2}
                                                    value={resource.description}
                                                    aria-invalid={Boolean(errors[description]) || undefined}
                                                    aria-describedby={describedBy(description)}
                                                    onChange={(event) => update({ description: event.target.value })}
                                                />
                                            </FormField>
                                        </div>
                                        <FormField
                                            id={fieldId(acquisition)}
                                            label="Tipo de aquisição"
                                            requiredIndicator
                                            error={errors[acquisition] ?? errors[`resources.${index}.assistive_technology_id`]}
                                        >
                                            <SelectField
                                                id={fieldId(acquisition)}
                                                name={`resources[${index}][acquisition_type]`}
                                                label="Tipo de aquisição"
                                                required
                                                value={resource.acquisition_type}
                                                options={acquisitionTypeOptions}
                                                disabled={disabled}
                                                aria-invalid={Boolean(errors[acquisition])}
                                                aria-describedby={describedBy(acquisition)}
                                                onChange={(event) => update({ acquisition_type: event.target.value })}
                                            />
                                        </FormField>
                                    </div>
                                );
                            }}
                        />
                    </FormSection>

                    <FormSection
                        id="paee-articulations"
                        title="Articulações e Orientações"
                        variant="inline"
                        iconClass="fa fa-handshake-o"
                    >
                        <FormGrid columns={2}>
                            {articulationFields.map((field) => (
                                field.wide ? (
                                    <FormGridWide key={field.name}>
                                        {textArea(field.name, field.label, { hint: field.hint })}
                                    </FormGridWide>
                                ) : (
                                    <div key={field.name}>
                                        {textArea(field.name, field.label, { hint: field.hint })}
                                    </div>
                                )
                            ))}
                        </FormGrid>
                    </FormSection>
                </fieldset>
            </CardBox>
            <FormActions
                status={form.processing
                    ? (editing ? "Salvando alterações…" : "Salvando PAEE…")
                    : undefined}
            >
                <Button
                    href={cancelHref}
                    tone="cancel"
                    label="Cancelar"
                    aria-label={editing ? "Cancelar e voltar ao PAEE" : "Cancelar e voltar ao Estudo de Caso"}
                    disabled={form.processing}
                />
                <Button
                    type="submit"
                    tone="save"
                    label="Salvar"
                    title={editing ? "Atualizar PAEE" : "Salvar PAEE"}
                    aria-label={editing ? "Atualizar PAEE" : "Salvar PAEE"}
                    disabled={form.processing}
                />
            </FormActions>
        </FormLayout>
    );
}
