import { TextAreaField } from '@/components/Forms/FormFields/FormFields';
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
    placeholder: string;
    rows: number;
    required?: boolean;
    /** Ocupa meia linha; os demais textos ocupam a largura toda. */
    half?: boolean;
}

const presenceDefinitions: TextFieldDefinition[] = [
    {
        field: 'student_participation',
        label: 'Participação',
        placeholder: 'Descreva o nível de participação do aluno...',
        rows: 3,
        required: true,
    },
    {
        field: 'adaptations_made',
        label: 'Adaptações para este Aluno',
        placeholder: 'Adaptações realizadas durante o atendimento AEE...',
        rows: 3,
    },
    {
        field: 'development_evaluation',
        label: 'Avaliação do Desenvolvimento',
        placeholder: 'Avaliação do desempenho e evolução do aluno...',
        rows: 3,
        required: true,
    },
    {
        field: 'progress_indicators',
        label: 'Indicadores de Progresso',
        placeholder: 'Evidências observáveis de progresso...',
        rows: 3,
    },
    {
        field: 'recommendations',
        label: 'Recomendações',
        placeholder: 'Sugestões para continuidade do trabalho...',
        rows: 3,
        half: true,
    },
    {
        field: 'next_session_adjustments',
        label: 'Ajustes para Próximo atendimento AEE',
        placeholder: 'O que ajustar ou manter para o próximo atendimento AEE...',
        rows: 3,
        half: true,
    },
];

const absenceDefinitions: TextFieldDefinition[] = [
    {
        field: 'absence_reason',
        label: 'Motivo da Ausência',
        placeholder: 'Informe o motivo da ausência do aluno...',
        rows: 2,
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
}

/**
 * Avaliação individual de um aluno: presença, participação de responsáveis e os textos do
 * desempenho (presente) ou o motivo da ausência. Textos simples, sem editor rico, como no legado.
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
}: AeeEvaluationFieldsProps): React.JSX.Element {
    const nameFor = (field: string): string => (namePrefix ? `${namePrefix}[${field}]` : field);
    const definitions = values.is_present ? presenceDefinitions : absenceDefinitions;

    function renderTextArea(definition: TextFieldDefinition): React.JSX.Element {
        const field = (
            <TextAreaField
                id={`${idPrefix}-${definition.field.replace(/_/g, '-')}`}
                name={nameFor(definition.field)}
                label={definition.label}
                rows={definition.rows}
                required={definition.required}
                placeholder={definition.placeholder}
                value={values[definition.field]}
                error={errorFor(definition.field)}
                disabled={disabled}
                onChange={(value) => onFieldChange(definition.field, value)}
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
            {definitions.map(renderTextArea)}
        </FormGrid>
    );
}
