import { TextAreaField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide, FormStack } from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import ToggleControl from '@/components/Forms/ToggleControl/ToggleControl';
import type { PedagogicalRecordFormData } from './PedagogicalRecordForm.types';

type TextFieldName = {
    [Key in keyof PedagogicalRecordFormData]: PedagogicalRecordFormData[Key] extends string
        ? Key
        : never;
}[keyof PedagogicalRecordFormData];

interface PedagogicalRecordFollowUpFieldsProps {
    data: PedagogicalRecordFormData;
    errors: Record<string, string | undefined>;
    disabled: boolean;
    onChange: (name: TextFieldName, value: string) => void;
    onPresenceChange: (isPresent: boolean) => void;
}

interface TextAreaConfig {
    name: TextFieldName;
    id: string;
    label: string;
    rows: number;
    placeholder: string;
    required?: boolean;
}

const absenceField: TextAreaConfig = {
    name: 'absence_reason',
    id: 'pedagogical-record-absence-reason',
    label: 'Motivo da Ausência',
    rows: 2,
    placeholder: 'Informe o motivo da ausência do aluno...',
    required: true,
};

/** Conteúdo exigido quando o aluno esteve presente ou houve responsáveis participantes. */
const pedagogicalContentFields: TextAreaConfig[] = [
    {
        name: 'systematic_pedagogical_follow_up_record',
        id: 'pedagogical-record-systematic-follow-up',
        label: 'Registro do Acompanhamento Pedagógico Sistemático',
        rows: 4,
        placeholder: 'Registre o acompanhamento pedagógico sistemático realizado...',
        required: true,
    },
    {
        name: 'strategies_and_resources_adopted',
        id: 'pedagogical-record-strategies',
        label: 'Estratégias e Recursos Adotados (quando necessário)',
        rows: 3,
        placeholder: 'Descreva as estratégias e os recursos adotados, quando necessário...',
    },
    {
        name: 'referrals_made',
        id: 'pedagogical-record-referrals',
        label: 'Encaminhamentos Realizados',
        rows: 3,
        placeholder: 'Informe os encaminhamentos realizados...',
    },
    {
        name: 'complementary_observations',
        id: 'pedagogical-record-observations',
        label: 'Observações Complementares',
        rows: 3,
        placeholder: 'Registre informações complementares relevantes...',
    },
];

/** Motivo, duração, presença e registro do acompanhamento pedagógico. */
export default function PedagogicalRecordFollowUpFields({
    data,
    errors,
    disabled,
    onChange,
    onPresenceChange,
}: PedagogicalRecordFollowUpFieldsProps): React.JSX.Element {
    const showAbsence = !data.is_present;
    const showPedagogicalContent = data.is_present || data.with_guardians;
    const visibleTextAreas = showPedagogicalContent ? pedagogicalContentFields : [];

    function renderTextArea(field: TextAreaConfig): React.JSX.Element {
        return (
            <FormGridWide key={field.name}>
                <TextAreaField
                    id={field.id}
                    name={field.name}
                    label={field.label}
                    rows={field.rows}
                    required={field.required}
                    placeholder={field.placeholder}
                    value={data[field.name]}
                    error={errors[field.name]}
                    onChange={(value) => onChange(field.name, value)}
                />
            </FormGridWide>
        );
    }

    return (
        <FormSection
            id="pedagogical-record-follow-up"
            title="Acompanhamento Pedagógico"
            variant="inline"
            iconClass="fa fa-book"
        >
            <FormGrid columns={2}>
                {renderTextArea({
                    name: 'follow_up_reason',
                    id: 'pedagogical-record-follow-up-reason',
                    label: 'Motivo do Acompanhamento',
                    rows: 3,
                    placeholder: 'Informe o motivo do acompanhamento pedagógico...',
                    required: true,
                })}
                <FormGridWide>
                    <TextInputField
                        id="pedagogical-record-duration"
                        name="duration"
                        label="Período/Duração do Acompanhamento"
                        required
                        maxLength={50}
                        placeholder="Ex: 50 minutos ou 01:00"
                        value={data.duration}
                        error={errors.duration}
                        onChange={(value) => onChange('duration', value)}
                    />
                </FormGridWide>
                <FormGridWide>
                    <FormStack>
                        <ToggleControl
                            id="pedagogical-record-is-present"
                            name="is_present"
                            size="small"
                            label="Presença do Estudante no Atendimento"
                            checked={data.is_present}
                            disabled={disabled}
                            onChange={onPresenceChange}
                        />
                    </FormStack>
                </FormGridWide>
                {showAbsence ? renderTextArea(absenceField) : null}
                {visibleTextAreas.map(renderTextArea)}
            </FormGrid>
        </FormSection>
    );
}
