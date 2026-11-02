import { RichTextField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import type { AeeRecordFormSectionProps, AeeRecordGeneralField } from './AeeRecordForm.types';

type GeneralTextField = Exclude<AeeRecordGeneralField, 'duration'>;

interface GeneralTextDefinition {
    field: GeneralTextField;
    label: string;
    /** Rótulo em minúsculas usado na mensagem de falha do editor. */
    failureLabel: string;
    required?: boolean;
    /** Ocupa a largura toda; os demais textos dividem a linha. */
    wide?: boolean;
}

const textDefinitions: GeneralTextDefinition[] = [
    {
        field: 'activities_performed',
        label: 'Atividades Planejadas/Realizadas',
        failureLabel: 'atividades planejadas/realizadas',
        required: true,
        wide: true,
    },
    {
        field: 'strategies_used',
        label: 'Estratégias Planejadas/Utilizadas',
        failureLabel: 'estratégias planejadas/utilizadas',
    },
    {
        field: 'resources_used',
        label: 'Recursos Planejados/Utilizados',
        failureLabel: 'recursos planejados/utilizados',
    },
    {
        field: 'general_observations',
        label: 'Observações Gerais',
        failureLabel: 'observações gerais',
        wide: true,
    },
];

interface AeeRecordGeneralFieldsProps extends AeeRecordFormSectionProps {
    onEditorFailure: (field: GeneralTextField, label: string) => void;
}

/** Duração e, em editores ricos, atividades, estratégias, recursos e observações gerais. */
export default function AeeRecordGeneralFields({
    form,
    errors,
    disabled,
    onEditorFailure,
}: AeeRecordGeneralFieldsProps): React.JSX.Element {
    function renderEditor(definition: GeneralTextDefinition): React.JSX.Element {
        const field = (
            <RichTextField
                id={`aee-record-${definition.field.replace(/_/g, '-')}`}
                label={definition.label}
                required={definition.required}
                defaultValue={form.data[definition.field]}
                height={120}
                disabled={disabled}
                error={errors[definition.field]}
                onLoadError={() => onEditorFailure(definition.field, definition.failureLabel)}
                onChange={(html) => form.setData(definition.field, html)}
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
                {textDefinitions.map(renderEditor)}
            </FormGrid>
        </FormSection>
    );
}
