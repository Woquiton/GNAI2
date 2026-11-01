import { RichTextField } from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import ToggleControl from '@/components/Forms/ToggleControl/ToggleControl';
import type { AeeGuardianOption } from '../AeeRecords.types';
import AeeEvaluationGuardianFields from './AeeEvaluationGuardianFields';
import type {
    AeeEvaluationFormData,
    AeeEvaluationGuardianChanges,
    AeeEvaluationTextField,
} from './AeeRecordForm.types';

interface TextFieldDefinition {
    field: AeeEvaluationTextField;
    label: string;
    /** Rótulo em minúsculas usado na mensagem de falha do editor. */
    failureLabel: string;
    required?: boolean;
    /** Ocupa meia linha; os demais textos ocupam a largura toda. */
    half?: boolean;
}

const presenceDefinitions: TextFieldDefinition[] = [
    {
        field: 'student_participation',
        label: 'Participação',
        failureLabel: 'participação',
        required: true,
    },
    {
        field: 'adaptations_made',
        label: 'Adaptações para este Aluno',
        failureLabel: 'adaptações para este aluno',
    },
    {
        field: 'development_evaluation',
        label: 'Avaliação do Desenvolvimento',
        failureLabel: 'avaliação do desenvolvimento',
        required: true,
    },
    {
        field: 'progress_indicators',
        label: 'Indicadores de Progresso',
        failureLabel: 'indicadores de progresso',
    },
    {
        field: 'recommendations',
        label: 'Recomendações',
        failureLabel: 'recomendações',
        half: true,
    },
    {
        field: 'next_session_adjustments',
        label: 'Ajustes para Próximo atendimento AEE',
        failureLabel: 'ajustes para o próximo atendimento AEE',
        half: true,
    },
];

const absenceDefinitions: TextFieldDefinition[] = [
    {
        field: 'absence_reason',
        label: 'Motivo da Ausência',
        failureLabel: 'motivo da ausência',
        required: true,
    },
];

interface AeeEvaluationFieldsProps {
    idPrefix: string;
    /** Prefixo dos nomes no registro com vários alunos (`evaluations[0]`). */
    namePrefix?: string;
    values: AeeEvaluationFormData;
    guardians: AeeGuardianOption[];
    errorFor: (field: string) => string | undefined;
    disabled: boolean;
    onPresenceChange: (present: boolean) => void;
    onGuardiansChange: (changes: AeeEvaluationGuardianChanges) => void;
    onFieldChange: (field: AeeEvaluationTextField, value: string) => void;
    onEditorFailure: (field: AeeEvaluationTextField, label: string) => void;
}

/**
 * Avaliação individual de um aluno: presença, participação de responsáveis e os textos do
 * desempenho (presente) ou o motivo da ausência, em editores ricos como no legado. Os editores
 * leem o valor só ao montar: os da presença e o da ausência remontam ao alternar a presença e
 * partem do valor atual; o consumidor deve dar a este componente uma `key` por aluno.
 */
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
    onEditorFailure,
}: AeeEvaluationFieldsProps): React.JSX.Element {
    const nameFor = (field: string): string => (namePrefix ? `${namePrefix}[${field}]` : field);
    const definitions = values.is_present ? presenceDefinitions : absenceDefinitions;

    function renderEditor(definition: TextFieldDefinition): React.JSX.Element {
        const field = (
            <RichTextField
                id={`${idPrefix}-${definition.field.replace(/_/g, '-')}`}
                label={definition.label}
                required={definition.required}
                defaultValue={values[definition.field]}
                height={120}
                disabled={disabled}
                error={errorFor(definition.field)}
                onLoadError={() => onEditorFailure(definition.field, definition.failureLabel)}
                onChange={(html) => onFieldChange(definition.field, html)}
            />
        );

        return definition.half ? (
            <div key={definition.field}>{field}</div>
        ) : (
            <FormGridWide key={definition.field}>{field}</FormGridWide>
        );
    }

    return (
        <FormGrid columns={2}>
            <FormGridWide>
                <ToggleControl
                    id={`${idPrefix}-is-present`}
                    name={nameFor('is_present')}
                    size="small"
                    label="Aluno Presente"
                    description={errorFor('is_present')}
                    checked={values.is_present}
                    disabled={disabled}
                    onChange={onPresenceChange}
                />
            </FormGridWide>
            {values.is_present ? (
                <AeeEvaluationGuardianFields
                    idPrefix={idPrefix}
                    nameFor={nameFor}
                    values={values}
                    guardians={guardians}
                    error={errorFor('guardian_ids') ?? errorFor('guardian_ids.0')}
                    disabled={disabled}
                    onChange={onGuardiansChange}
                />
            ) : null}
            {definitions.map(renderEditor)}
        </FormGrid>
    );
}
