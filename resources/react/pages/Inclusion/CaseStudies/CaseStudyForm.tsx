import { useRef, useState } from "react";
import { useForm } from "@inertiajs/react";
import ChoiceControl from "@/components/Forms/ChoiceControl/ChoiceControl";
import ChoiceGroup from "@/components/Forms/ChoiceGroup/ChoiceGroup";
import DatePicker from "@/components/Forms/DatePicker/DatePicker";
import FormActions from "@/components/Forms/FormActions/FormActions";
import FormField from "@/components/Forms/FormField/FormField";
import FormGrid, { FormGridWide } from "@/components/Forms/FormGrid/FormGrid";
import FormLayout from "@/components/Forms/FormLayout/FormLayout";
import FormSection from "@/components/Forms/FormSection/FormSection";
import RemovableField from "@/components/Forms/RemovableField/RemovableField";
import RepeaterField from "@/components/Forms/RepeaterField/RepeaterField";
import SelectField from "@/components/Forms/SelectField/SelectField";
import SummernoteEditor from "@/components/Forms/SummernoteEditor/SummernoteEditor";
import TextArea from "@/components/Forms/TextArea/TextArea";
import BusinessPage from "@/components/Navigation/BusinessPage/BusinessPage";
import {
    studentRecordUrl,
    studentsBase,
} from "@/components/Students/Students.utils";
import Button from "@/components/UI/Button/Button";
import CardBox from "@/components/UI/CardBox/CardBox";
import {
    caseStudiesBase,
    caseStudiesTab,
    caseStudyUrl,
    requestFailureHandlers,
} from "./caseStudies.utils";
import type {
    CaseStudyBarrierInput,
    CaseStudyFormProps,
    CaseStudyStrategyInput,
} from "./CaseStudies.types";

type CaseStudyFormData = {
    demand_origin: string;
    participants_summary: string;
    study_date: string;
    student_observation: string;
    student_family_listening: string;
    teachers_listening: string;
    other_info: string;
    care_network_notes: string;
    favorable_aspects: string;
    potentials_interests: string;
    needed_supports: string[];
    needed_supports_justification: string;
    acceptance_status: string;
    acceptance_date: string;
    barriers: CaseStudyBarrierInput[];
    strategies: CaseStudyStrategyInput[];
};

type CaseStudyTextField = {
    [Key in keyof CaseStudyFormData]: CaseStudyFormData[Key] extends string ? Key : never;
}[keyof CaseStudyFormData];

const fieldId = (name: string): string => `case-study-${name.replace(/[_.]/g, "-")}`;

/** Formulário único de cadastro e edição do Estudo de Caso. */
export default function CaseStudyForm({
    student,
    caseStudy,
    options,
}: CaseStudyFormProps): React.JSX.Element {
    const editing = caseStudy !== null;
    const busy = useRef(false);
    const [editorFailed, setEditorFailed] = useState(false);
    const element = useRef<HTMLFormElement>(null);
    const studentHref = studentRecordUrl(student.id, caseStudiesTab);
    const cancelHref = caseStudy ? caseStudyUrl(caseStudy.id) : studentHref;
    const form = useForm<CaseStudyFormData>({
        demand_origin: caseStudy?.demand_origin ?? "",
        participants_summary: caseStudy?.participants_summary ?? "",
        study_date: caseStudy?.study_date ?? "",
        student_observation: caseStudy?.student_observation ?? "",
        student_family_listening: caseStudy?.student_family_listening ?? "",
        teachers_listening: caseStudy?.teachers_listening ?? "",
        other_info: caseStudy?.other_info ?? "",
        care_network_notes: caseStudy?.care_network_notes ?? "",
        favorable_aspects: caseStudy?.favorable_aspects ?? "",
        potentials_interests: caseStudy?.potentials_interests ?? "",
        needed_supports: caseStudy?.needed_supports ?? [],
        needed_supports_justification: caseStudy?.needed_supports_justification ?? "",
        acceptance_status: caseStudy?.acceptance_status ?? "",
        acceptance_date: caseStudy?.acceptance_date ?? "",
        barriers: caseStudy?.barriers ?? [],
        strategies: caseStudy?.strategies ?? [],
    });
    const errors = form.errors as Record<string, string | undefined>;
    const supportsError = errors.needed_supports
        ?? Object.entries(errors).find(([key]) => key.startsWith("needed_supports."))?.[1];

    function describedBy(name: string, hint = false): string | undefined {
        const id = fieldId(name);

        return [hint ? `${id}-hint` : undefined, errors[name] ? `${id}-error` : undefined]
            .filter(Boolean)
            .join(" ") || undefined;
    }

    function richText(
        name: CaseStudyTextField,
        label: string,
        { required = false, rows = 3 }: { required?: boolean; rows?: number } = {},
    ): React.JSX.Element {
        const id = fieldId(name);
        const inputId = `${id}-input`;

        return (
            <FormField
                id={inputId}
                label={label}
                requiredIndicator={required}
                error={errors[name]}
            >
                <SummernoteEditor
                    id={id}
                    label={label}
                    height={rows === 2 ? 120 : 160}
                    defaultValue={form.data[name]}
                    disabled={form.processing}
                    invalid={!!errors[name]}
                    describedBy={errors[name] ? `${inputId}-error` : undefined}
                    onChange={(html) => form.setData(name, html)}
                    onLoadError={() => {
                        setEditorFailed(true);
                        form.setError(name, "Não foi possível carregar o editor. Atualize a página e tente novamente.");
                    }}
                />
            </FormField>
        );
    }

    function toggleSupport(value: string, checked: boolean): void {
        form.setData((current) => ({
            ...current,
            needed_supports: checked
                ? [...current.needed_supports, value]
                : current.needed_supports.filter((item) => item !== value),
        }));
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
        if (busy.current || form.processing || editorFailed) return;

        busy.current = true;
        const requestOptions = {
            preserveScroll: true,
            onError: focusFirstError,
            ...requestFailureHandlers("Não foi possível salvar o Estudo de Caso. Tente novamente."),
            onFinish: () => {
                busy.current = false;
            },
        };

        if (caseStudy) {
            form.put(`${caseStudiesBase}/${caseStudy.id}`, requestOptions);
        } else {
            form.post(`${caseStudiesBase}/${student.id}/store`, requestOptions);
        }
    }

    return (
        <BusinessPage
            title={caseStudy ? `Editar Estudo de Caso (v${caseStudy.version})` : "Novo Estudo de Caso"}
            subtitle={`Aluno: ${student.name}`}
            breadcrumbItems={[
                { label: "Home", href: "/auth/dashboard" },
                { label: "Alunos", href: studentsBase },
                { label: student.name, href: studentHref },
                ...(caseStudy
                    ? [
                        { label: `Estudo de Caso v${caseStudy.version}`, href: caseStudyUrl(caseStudy.id) },
                        { label: "Editar" },
                    ]
                    : [{ label: "Novo Estudo de Caso" }]),
            ]}
            className="caseStudiesPage"
        >
            <FormLayout
                ref={element}
                aria-label={editing ? "Editar Estudo de Caso" : "Cadastrar Estudo de Caso"}
                aria-busy={form.processing}
                onSubmit={submit}
            >
                <CardBox>
                    <fieldset disabled={form.processing}>
                        <FormSection
                            id="case-study-demand"
                            title="Identificação da Demanda"
                            variant="inline"
                            iconClass="fa fa-bullhorn"
                        >
                            <FormGrid columns={2}>
                                <FormField
                                    id={fieldId("demand_origin")}
                                    label="Origem da demanda"
                                    requiredIndicator
                                    error={errors.demand_origin}
                                >
                                    <SelectField
                                        id={fieldId("demand_origin")}
                                        name="demand_origin"
                                        label="Origem da demanda"
                                        required
                                        value={form.data.demand_origin}
                                        options={options.demandOrigins}
                                        aria-invalid={!!errors.demand_origin}
                                        aria-describedby={describedBy("demand_origin")}
                                        disabled={form.processing}
                                        onChange={(event) => form.setData("demand_origin", event.target.value)}
                                    />
                                </FormField>
                                <FormField
                                    id={fieldId("study_date")}
                                    label="Data do Estudo de Caso"
                                    hint="Data em que o Estudo de Caso foi realizado com os participantes."
                                    hintLabel="Mais informações sobre a data do Estudo de Caso"
                                    error={errors.study_date}
                                >
                                    <DatePicker
                                        id={fieldId("study_date")}
                                        name="study_date"
                                        label="Data do Estudo de Caso"
                                        disabled={form.processing}
                                        value={form.data.study_date}
                                        invalid={!!errors.study_date}
                                        describedBy={describedBy("study_date")}
                                        onChange={(value) => form.setData("study_date", value)}
                                    />
                                </FormField>
                                <FormGridWide>
                                    {richText("participants_summary", "Participantes (resumo)", { rows: 2 })}
                                </FormGridWide>
                            </FormGrid>
                        </FormSection>

                        <FormSection
                            id="case-study-listening"
                            title="Escuta e Observação"
                            variant="inline"
                            iconClass="fa fa-comments-o"
                        >
                            <FormGrid columns={2}>
                                <FormGridWide>
                                    <FormGrid columns={3}>
                                        {richText("student_observation", "Observação do estudante", { required: true })}
                                        {richText("student_family_listening", "Escuta do estudante/família", { required: true })}
                                        {richText("teachers_listening", "Escuta dos professores", { required: true })}
                                    </FormGrid>
                                </FormGridWide>
                                {richText("other_info", "Outras informações", { rows: 2 })}
                                {richText("care_network_notes", "Observações da rede de cuidado", { rows: 2 })}
                            </FormGrid>
                        </FormSection>

                        <FormSection
                            id="case-study-potentials"
                            title="Potencialidades e Apoios"
                            variant="inline"
                            iconClass="fa fa-star-o"
                        >
                            <FormGrid columns={2}>
                                {richText("favorable_aspects", "Aspectos favoráveis", { required: true })}
                                {richText("potentials_interests", "Potenciais e interesses", { required: true })}
                                <FormGridWide>
                                    <FormField
                                        id={fieldId("needed_supports")}
                                        label="Apoios necessários"
                                        requiredIndicator
                                        error={supportsError}
                                    >
                                        <ChoiceGroup
                                            id={fieldId("needed_supports")}
                                            label="Apoios necessários"
                                            invalid={!!supportsError}
                                            describedBy={supportsError ? `${fieldId("needed_supports")}-error` : undefined}
                                        >
                                            {options.neededSupports.map((option) => (
                                                <ChoiceControl
                                                    key={option.value}
                                                    type="checkbox"
                                                    tone="purple"
                                                    id={`case-study-support-${option.value}`}
                                                    name="needed_supports[]"
                                                    label={option.label}
                                                    checked={form.data.needed_supports.includes(option.value)}
                                                    disabled={form.processing}
                                                    onChange={(checked) => toggleSupport(option.value, checked)}
                                                />
                                            ))}
                                        </ChoiceGroup>
                                    </FormField>
                                </FormGridWide>
                                <FormGridWide>
                                    {richText("needed_supports_justification", "Justificativa dos apoios necessários", { rows: 2 })}
                                </FormGridWide>
                            </FormGrid>
                        </FormSection>

                        <FormSection
                            id="case-study-barriers"
                            title="Barreiras Identificadas"
                            variant="inline"
                            iconClass="fa fa-ban"
                        >
                            <RepeaterField<CaseStudyBarrierInput>
                                items={form.data.barriers}
                                onChange={(barriers) => form.setData("barriers", barriers)}
                                createItem={() => ({
                                    type: "",
                                    observed_situation: "",
                                    participation_implication: "",
                                })}
                                itemLabel={(index) => `Barreira ${index + 1}`}
                                addLabel="Barreira"
                                emptyMessage="Nenhuma barreira adicionada."
                                disabled={form.processing}
                                removePlacement="field"
                                renderItem={(barrier, index, update, remove) => {
                                    const prefix = `barriers.${index}`;

                                    return (
                                        <FormGrid columns={2}>
                                            <FormGridWide>
                                                <FormField
                                                    id={fieldId(`${prefix}.type`)}
                                                    label="Categoria de barreira"
                                                    requiredIndicator
                                                    error={errors[`${prefix}.type`]}
                                                >
                                                    <RemovableField
                                                        removeLabel={`Remover barreira ${index + 1}`}
                                                        disabled={form.processing}
                                                        onRemove={remove}
                                                    >
                                                        <SelectField
                                                            id={fieldId(`${prefix}.type`)}
                                                            name={`barriers[${index}][type]`}
                                                            label="Categoria de barreira"
                                                            required
                                                            value={barrier.type}
                                                            options={options.barrierTypes}
                                                            aria-invalid={!!errors[`${prefix}.type`]}
                                                            aria-describedby={describedBy(`${prefix}.type`)}
                                                            disabled={form.processing}
                                                            onChange={(event) => update({ type: event.target.value })}
                                                        />
                                                    </RemovableField>
                                                </FormField>
                                            </FormGridWide>
                                            <FormField
                                                id={fieldId(`${prefix}.observed_situation`)}
                                                label="Situação observada"
                                                requiredIndicator
                                                error={errors[`${prefix}.observed_situation`]}
                                            >
                                                <TextArea
                                                    id={fieldId(`${prefix}.observed_situation`)}
                                                    name={`barriers[${index}][observed_situation]`}
                                                    rows={2}
                                                    required
                                                    value={barrier.observed_situation}
                                                    aria-invalid={!!errors[`${prefix}.observed_situation`] || undefined}
                                                    aria-describedby={describedBy(`${prefix}.observed_situation`)}
                                                    onChange={(event) => update({ observed_situation: event.target.value })}
                                                />
                                            </FormField>
                                            <FormField
                                                id={fieldId(`${prefix}.participation_implication`)}
                                                label="Implicação na participação"
                                                requiredIndicator
                                                error={errors[`${prefix}.participation_implication`]}
                                            >
                                                <TextArea
                                                    id={fieldId(`${prefix}.participation_implication`)}
                                                    name={`barriers[${index}][participation_implication]`}
                                                    rows={2}
                                                    required
                                                    value={barrier.participation_implication}
                                                    aria-invalid={!!errors[`${prefix}.participation_implication`] || undefined}
                                                    aria-describedby={describedBy(`${prefix}.participation_implication`)}
                                                    onChange={(event) => update({ participation_implication: event.target.value })}
                                                />
                                            </FormField>
                                        </FormGrid>
                                    );
                                }}
                            />
                        </FormSection>

                        <FormSection
                            id="case-study-strategies"
                            title="Estratégias Propostas"
                            variant="inline"
                            iconClass="fa fa-lightbulb-o"
                        >
                            <RepeaterField<CaseStudyStrategyInput>
                                items={form.data.strategies}
                                onChange={(strategies) => form.setData("strategies", strategies)}
                                createItem={() => ({ description: "" })}
                                itemLabel={(index) => `Estratégia ${index + 1}`}
                                addLabel="Estratégia"
                                emptyMessage="Nenhuma estratégia adicionada."
                                disabled={form.processing}
                                removePlacement="field"
                                renderItem={(strategy, index, update, remove) => {
                                    const name = `strategies.${index}.description`;

                                    return (
                                        <FormField
                                            id={fieldId(name)}
                                            label="Descrição da estratégia"
                                            requiredIndicator
                                            error={errors[name]}
                                        >
                                            <RemovableField
                                                removeLabel={`Remover estratégia ${index + 1}`}
                                                disabled={form.processing}
                                                onRemove={remove}
                                            >
                                                <TextArea
                                                    id={fieldId(name)}
                                                    name={`strategies[${index}][description]`}
                                                    rows={2}
                                                    required
                                                    value={strategy.description}
                                                    aria-invalid={!!errors[name] || undefined}
                                                    aria-describedby={describedBy(name)}
                                                    onChange={(event) => update({ description: event.target.value })}
                                                />
                                            </RemovableField>
                                        </FormField>
                                    );
                                }}
                            />
                        </FormSection>

                        <FormSection
                            id="case-study-acceptance"
                            title="Aceite da Família/Estudante"
                            variant="inline"
                            iconClass="fa fa-thumbs-o-up"
                        >
                            <FormGrid columns={2}>
                                <FormField
                                    id={fieldId("acceptance_status")}
                                    label="Status de aceite"
                                    requiredIndicator
                                    error={errors.acceptance_status}
                                >
                                    <SelectField
                                        id={fieldId("acceptance_status")}
                                        name="acceptance_status"
                                        label="Status de aceite"
                                        required
                                        value={form.data.acceptance_status}
                                        options={options.acceptanceStatuses}
                                        aria-invalid={!!errors.acceptance_status}
                                        aria-describedby={describedBy("acceptance_status")}
                                        disabled={form.processing}
                                        onChange={(event) => form.setData("acceptance_status", event.target.value)}
                                    />
                                </FormField>
                                <FormField
                                    id={fieldId("acceptance_date")}
                                    label="Data do aceite"
                                    error={errors.acceptance_date}
                                >
                                    <DatePicker
                                        id={fieldId("acceptance_date")}
                                        name="acceptance_date"
                                        label="Data do aceite"
                                        disabled={form.processing}
                                        value={form.data.acceptance_date}
                                        invalid={!!errors.acceptance_date}
                                        describedBy={describedBy("acceptance_date")}
                                        onChange={(value) => form.setData("acceptance_date", value)}
                                    />
                                </FormField>
                            </FormGrid>
                        </FormSection>
                    </fieldset>
                </CardBox>
                <FormActions
                    status={form.processing
                        ? (editing ? "Salvando alterações…" : "Salvando Estudo de Caso…")
                        : undefined}
                >
                    <Button
                        href={cancelHref}
                        tone="cancel"
                        label="Cancelar"
                        aria-label={editing ? "Cancelar e voltar ao Estudo de Caso" : "Cancelar e voltar ao prontuário do aluno"}
                        disabled={form.processing}
                    />
                    <Button
                        type="submit"
                        tone="save"
                        label="Salvar"
                        title={editing ? "Atualizar Estudo de Caso" : "Salvar Estudo de Caso"}
                        aria-label={editing ? "Atualizar Estudo de Caso" : "Salvar Estudo de Caso"}
                        disabled={form.processing || editorFailed}
                    />
                </FormActions>
            </FormLayout>
        </BusinessPage>
    );
}
