import { RichTextField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide, FormStack } from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import ToggleControl from '@/components/Forms/ToggleControl/ToggleControl';
import { PEDAGOGICAL_RECORD_TOUR_TARGETS } from '../pedagogicalRecordTours';
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
    onEditorFailure: (name: TextFieldName, label: string) => void;
}

interface RichTextConfig {
    name: TextFieldName;
    id: string;
    label: string;
    /** Rótulo em minúsculas usado na mensagem de falha do editor. */
    failureLabel: string;
    height: number;
    required?: boolean;
}

const followUpReasonField: RichTextConfig = {
    name: 'follow_up_reason',
    id: 'pedagogical-record-follow-up-reason',
    label: 'Motivo do Acompanhamento',
    failureLabel: 'motivo do acompanhamento',
    height: 120,
    required: true,
};

const absenceField: RichTextConfig = {
    name: 'absence_reason',
    id: 'pedagogical-record-absence-reason',
    label: 'Motivo da Ausência',
    failureLabel: 'motivo da ausência',
    height: 120,
    required: true,
};

/** Conteúdo exigido quando o aluno esteve presente ou houve responsáveis participantes. */
const pedagogicalContentFields: RichTextConfig[] = [
    {
        name: 'systematic_pedagogical_follow_up_record',
        id: 'pedagogical-record-systematic-follow-up',
        label: 'Registro do Acompanhamento Pedagógico Sistemático',
        failureLabel: 'registro do acompanhamento pedagógico sistemático',
        height: 160,
        required: true,
    },
    {
        name: 'strategies_and_resources_adopted',
        id: 'pedagogical-record-strategies',
        label: 'Estratégias e Recursos Adotados (quando necessário)',
        failureLabel: 'estratégias e recursos adotados',
        height: 120,
    },
    {
        name: 'referrals_made',
        id: 'pedagogical-record-referrals',
        label: 'Encaminhamentos Realizados',
        failureLabel: 'encaminhamentos realizados',
        height: 120,
    },
    {
        name: 'complementary_observations',
        id: 'pedagogical-record-observations',
        label: 'Observações Complementares',
        failureLabel: 'observações complementares',
        height: 120,
    },
];

/** Motivo, duração, presença e registro do acompanhamento pedagógico. */
export default function PedagogicalRecordFollowUpFields({
    data,
    errors,
    disabled,
    onChange,
    onPresenceChange,
    onEditorFailure,
}: PedagogicalRecordFollowUpFieldsProps): React.JSX.Element {
    const showAbsence = !data.is_present;
    const showPedagogicalContent = data.is_present || data.with_guardians;
    const visibleEditors = showPedagogicalContent ? pedagogicalContentFields : [];

    /**
     * O editor lê o valor só ao montar; os campos condicionais remontam ao reaparecer e partem
     * do valor atual do formulário.
     */
    function renderEditor(field: RichTextConfig): React.JSX.Element {
        return (
            <FormGridWide key={field.name}>
                <RichTextField
                    id={field.id}
                    label={field.label}
                    required={field.required}
                    defaultValue={data[field.name]}
                    height={field.height}
                    disabled={disabled}
                    error={errors[field.name]}
                    onLoadError={() => onEditorFailure(field.name, field.failureLabel)}
                    onChange={(html) => onChange(field.name, html)}
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
            tourTarget={PEDAGOGICAL_RECORD_TOUR_TARGETS.followUp}
        >
            <FormGrid columns={2}>
                {renderEditor(followUpReasonField)}
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
                {showAbsence ? renderEditor(absenceField) : null}
                {visibleEditors.map(renderEditor)}
            </FormGrid>
        </FormSection>
    );
}
