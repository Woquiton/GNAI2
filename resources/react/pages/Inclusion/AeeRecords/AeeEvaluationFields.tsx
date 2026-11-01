import ChoiceControl from "@/components/Forms/ChoiceControl/ChoiceControl";
import ChoiceGroup from "@/components/Forms/ChoiceGroup/ChoiceGroup";
import FormField from "@/components/Forms/FormField/FormField";
import FormGrid from "@/components/Forms/FormGrid/FormGrid";
import { FormGridWide } from "@/components/Forms/FormGrid/FormGrid";
import TextArea from "@/components/Forms/TextArea/TextArea";
import ToggleControl from "@/components/Forms/ToggleControl/ToggleControl";
import type {
    AeeEvaluationFormData,
    AeeEvaluationTextField,
    AeeGuardianOption,
} from "./AeeRecord.types";

interface TextFieldDefinition {
    field: AeeEvaluationTextField;
    label: string;
    placeholder: string;
    required?: boolean;
    half?: boolean;
}

const presenceDefinitions: TextFieldDefinition[] = [
    {
        field: "student_participation",
        label: "Participação",
        placeholder: "Descreva o nível de participação do aluno...",
        required: true,
    },
    {
        field: "adaptations_made",
        label: "Adaptações para este Aluno",
        placeholder: "Adaptações realizadas durante o atendimento AEE...",
    },
    {
        field: "development_evaluation",
        label: "Avaliação do Desenvolvimento",
        placeholder: "Avaliação do desempenho e evolução do aluno...",
        required: true,
    },
    {
        field: "progress_indicators",
        label: "Indicadores de Progresso",
        placeholder: "Evidências observáveis de progresso...",
    },
    {
        field: "recommendations",
        label: "Recomendações",
        placeholder: "Sugestões para continuidade do trabalho...",
        half: true,
    },
    {
        field: "next_session_adjustments",
        label: "Ajustes para Próximo atendimento AEE",
        placeholder: "O que ajustar ou manter para o próximo atendimento AEE...",
        half: true,
    },
];

const absenceDefinition: TextFieldDefinition = {
    field: "absence_reason",
    label: "Motivo da Ausência",
    placeholder: "Informe o motivo da ausência do aluno...",
    required: true,
};

export default function AeeEvaluationFields({
    idPrefix,
    namePrefix,
    values,
    guardians,
    errorFor,
    disabled,
    onPresenceChange,
    onGuardiansChange,
    onFieldChange,
}: {
    idPrefix: string;
    namePrefix?: string;
    values: AeeEvaluationFormData;
    guardians: AeeGuardianOption[];
    errorFor: (field: string) => string | undefined;
    disabled: boolean;
    onPresenceChange: (present: boolean) => void;
    onGuardiansChange: (changes: Pick<AeeEvaluationFormData, "with_guardians" | "guardian_ids">) => void;
    onFieldChange: (field: AeeEvaluationTextField, value: string) => void;
}): React.JSX.Element {
    const nameFor = (field: string): string => (
        namePrefix ? `${namePrefix}[${field}]` : field
    );

    const renderTextArea = (definition: TextFieldDefinition): React.JSX.Element => {
        const id = `${idPrefix}-${definition.field.replace(/_/g, "-")}`;
        const error = errorFor(definition.field);

        return (
            <FormField
                id={id}
                label={definition.label}
                requiredIndicator={definition.required}
                error={error}
            >
                <TextArea
                    id={id}
                    name={nameFor(definition.field)}
                    rows={definition.field === "absence_reason" ? 2 : 3}
                    required={definition.required}
                    placeholder={definition.placeholder}
                    value={values[definition.field]}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${id}-error` : undefined}
                    disabled={disabled}
                    onChange={(event) => onFieldChange(definition.field, event.target.value)}
                />
            </FormField>
        );
    };

    const presenceError = errorFor("is_present");
    const hasGuardians = guardians.length > 0;
    const guardiansId = `${idPrefix}-guardians`;
    const guardianError = errorFor("guardian_ids") ?? errorFor("guardian_ids.0");

    const toggleGuardian = (id: number, checked: boolean): void => {
        onGuardiansChange({
            with_guardians: values.with_guardians,
            guardian_ids: checked
                ? [...values.guardian_ids.filter((item) => item !== id), id]
                : values.guardian_ids.filter((item) => item !== id),
        });
    };

    // Devolutiva à família: aparece no PEI como acompanhamento com responsáveis.
    const guardianFields = (
        <>
            <FormGridWide>
                <ToggleControl
                    id={`${idPrefix}-with-guardians`}
                    name={nameFor("with_guardians")}
                    size="small"
                    label="Atendimento realizado com participação de responsável"
                    description={hasGuardians
                        ? "Esta conversa será exibida no PEI como devolutiva à família."
                        : "O aluno não possui responsáveis cadastrados no sistema."}
                    checked={values.with_guardians}
                    disabled={!hasGuardians || disabled}
                    onChange={(checked) => onGuardiansChange({
                        with_guardians: checked,
                        guardian_ids: checked ? values.guardian_ids : [],
                    })}
                />
            </FormGridWide>
            {values.with_guardians ? (
                <FormGridWide>
                    <FormField
                        id={guardiansId}
                        label="Responsáveis participantes"
                        error={guardianError}
                    >
                        <ChoiceGroup
                            id={guardiansId}
                            label="Responsáveis participantes"
                            invalid={!!guardianError}
                            describedBy={guardianError ? `${guardiansId}-error` : undefined}
                        >
                            {guardians.map((guardian) => (
                                <ChoiceControl
                                    key={guardian.id}
                                    type="checkbox"
                                    tone="purple"
                                    id={`${guardiansId}-${guardian.id}`}
                                    name={`${nameFor("guardian_ids")}[]`}
                                    label={(
                                        <>
                                            <strong>{guardian.name}</strong>
                                            {", "}{guardian.relationship_label}
                                        </>
                                    )}
                                    aria-label={`${guardian.name}, ${guardian.relationship_label}`}
                                    checked={values.guardian_ids.includes(guardian.id)}
                                    disabled={disabled}
                                    onChange={(checked) => toggleGuardian(guardian.id, checked)}
                                />
                            ))}
                        </ChoiceGroup>
                    </FormField>
                </FormGridWide>
            ) : null}
        </>
    );

    return (
        <FormGrid columns={2}>
            <FormGridWide>
                <ToggleControl
                    id={`${idPrefix}-is-present`}
                    name={nameFor("is_present")}
                    size="small"
                    label="Aluno Presente"
                    description={presenceError}
                    checked={values.is_present}
                    disabled={disabled}
                    onChange={onPresenceChange}
                />
            </FormGridWide>
            {values.is_present ? guardianFields : null}
            {values.is_present ? (
                presenceDefinitions.map((definition) => (
                    definition.half ? (
                        <div key={definition.field}>
                            {renderTextArea(definition)}
                        </div>
                    ) : (
                        <FormGridWide key={definition.field}>
                            {renderTextArea(definition)}
                        </FormGridWide>
                    )
                ))
            ) : (
                <FormGridWide>
                    {renderTextArea(absenceDefinition)}
                </FormGridWide>
            )}
        </FormGrid>
    );
}
