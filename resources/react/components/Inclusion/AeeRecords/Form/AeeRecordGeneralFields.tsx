import { TextAreaField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import type { AeeRecordFormSectionProps, AeeRecordGeneralField } from './AeeRecordForm.types';

interface GeneralTextDefinition {
    field: Exclude<AeeRecordGeneralField, 'duration'>;
    label: string;
    placeholder: string;
    rows: number;
    required?: boolean;
    /** Ocupa a largura toda; os demais textos dividem a linha. */
    wide?: boolean;
}

const textDefinitions: GeneralTextDefinition[] = [
    {
        field: 'activities_performed',
        label: 'Atividades Planejadas/Realizadas',
        placeholder: 'Descreva as atividades realizadas durante o atendimento AEE...',
        rows: 3,
        required: true,
        wide: true,
    },
    {
        field: 'strategies_used',
        label: 'Estratégias Planejadas/Utilizadas',
        placeholder: 'Métodos, abordagens pedagógicas ou intervenções utilizadas...',
        rows: 2,
    },
    {
        field: 'resources_used',
        label: 'Recursos Planejados/Utilizados',
        placeholder: 'Materiais, tecnologias ou instrumentos utilizados...',
        rows: 2,
    },
    {
        field: 'general_observations',
        label: 'Observações Gerais',
        placeholder: 'Observações relevantes sobre o atendimento AEE...',
        rows: 2,
        wide: true,
    },
];

/** Duração, atividades, estratégias, recursos e observações gerais da execução. */
export default function AeeRecordGeneralFields({
    form,
    errors,
    disabled,
}: AeeRecordFormSectionProps): React.JSX.Element {
    function renderTextArea(definition: GeneralTextDefinition): React.JSX.Element {
        const field = (
            <TextAreaField
                id={`aee-record-${definition.field.replace(/_/g, '-')}`}
                name={definition.field}
                label={definition.label}
                rows={definition.rows}
                required={definition.required}
                placeholder={definition.placeholder}
                value={form.data[definition.field]}
                error={errors[definition.field]}
                disabled={disabled}
                onChange={(value) => form.setData(definition.field, value)}
            />
        );

        return definition.wide ? (
            <FormGridWide key={definition.field}>{field}</FormGridWide>
        ) : (
            <div key={definition.field}>{field}</div>
        );
    }

    return (
        <FormSection
            id="aee-record-general"
            title="Informações Gerais da Execução"
            variant="inline"
            iconClass="fa fa-clipboard"
        >
            <FormGrid columns={2}>
                <TextInputField
                    id="aee-record-duration"
                    name="duration"
                    label="Duração"
                    required
                    maxLength={50}
                    placeholder="Ex: 50 minutos ou 01:00"
                    value={form.data.duration}
                    error={errors.duration}
                    disabled={disabled}
                    onChange={(value) => form.setData('duration', value)}
                />
                {textDefinitions.map(renderTextArea)}
            </FormGrid>
        </FormSection>
    );
}
