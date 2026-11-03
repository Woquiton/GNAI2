import {
    CheckboxListField,
    SelectInputField,
    TextAreaField,
} from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import InfoTooltip from '@/components/UI/InfoTooltip/InfoTooltip';
import type { SupportRequestOptions } from '../SupportRequests.types';
import type { SupportRequestFieldsProps } from './SupportRequestForm.types';

export default function SupportRequestDemandFields({
    data,
    errors,
    disabled,
    update,
    options,
}: SupportRequestFieldsProps & { options: SupportRequestOptions }): React.JSX.Element {
    const supportsError =
        errors.requested_supports ??
        Object.entries(errors).find(([key]) => key.startsWith('requested_supports.'))?.[1];

    const profilesError =
        errors.reason_profile_ids ??
        Object.entries(errors).find(([key]) => key.startsWith('reason_profile_ids.'))?.[1];
    const hasProfiles = data.reason_type === 'profile';
    const reasonRequired = data.reason_type === 'other';
    const profilesHint = options.reasonProfiles.length
        ? undefined
        : 'Nenhum perfil de atendimento disponível. Cadastre um perfil ou escolha Outro para descrever a demanda.';

    return (
        <FormSection
            id="support-request-demand"
            title="Solicitação"
            variant="inline"
            iconClass="fa fa-file-text-o"
            titleAddon={
                <InfoTooltip
                    label="Mais informações sobre a solicitação"
                    text="Registre as necessidades relatadas. Diagnóstico e laudo não são obrigatórios para solicitar atendimento."
                />
            }
        >
            <FormGrid columns={2}>
                <FormGridWide>
                    <SelectInputField
                        id="support-request-reason-type"
                        name="reason_type"
                        label="Motivo da solicitação"
                        required
                        options={options.reasonTypes}
                        value={data.reason_type}
                        error={errors.reason_type}
                        disabled={disabled}
                        onChange={(value) => update('reason_type', value)}
                    />
                </FormGridWide>
                {hasProfiles ? (
                    <FormGridWide>
                        <CheckboxListField
                            id="support-request-reason-profiles"
                            name="reason_profile_ids"
                            label="Perfis de atendimento"
                            required
                            options={options.reasonProfiles}
                            hint={profilesHint}
                            value={data.reason_profile_ids}
                            error={profilesError}
                            disabled={disabled}
                            onChange={(values) => update('reason_profile_ids', values)}
                        />
                    </FormGridWide>
                ) : null}
                <TextAreaField
                    id="support-request-reason"
                    name="reason"
                    label="Descrição do motivo"
                    required={reasonRequired}
                    rows={4}
                    maxLength={10000}
                    value={data.reason}
                    error={errors.reason}
                    onChange={(value) => update('reason', value)}
                />
                <TextAreaField
                    id="support-request-difficulties"
                    name="school_difficulties"
                    label="Dificuldades no contexto escolar"
                    rows={4}
                    maxLength={10000}
                    value={data.school_difficulties}
                    error={errors.school_difficulties}
                    onChange={(value) => update('school_difficulties', value)}
                />
                <SelectInputField
                    id="support-request-diagnosis"
                    name="diagnosis_status"
                    label="Situação diagnóstica informada"
                    hint="Informação relatada sobre diagnóstico. Não define o andamento da solicitação."
                    hintLabel="Mais informações sobre a situação diagnóstica informada"
                    options={options.diagnosisStatuses}
                    value={data.diagnosis_status}
                    error={errors.diagnosis_status}
                    disabled={disabled}
                    onChange={(value) => update('diagnosis_status', value)}
                />
                <TextAreaField
                    id="support-request-diagnosis-notes"
                    name="diagnosis_notes"
                    label="Datas ou observações sobre a investigação"
                    rows={3}
                    maxLength={5000}
                    value={data.diagnosis_notes}
                    error={errors.diagnosis_notes}
                    onChange={(value) => update('diagnosis_notes', value)}
                />
                <FormGridWide>
                    <CheckboxListField
                        id="support-request-supports"
                        name="requested_supports"
                        label="Apoios solicitados"
                        options={options.supports}
                        value={data.requested_supports}
                        error={supportsError}
                        disabled={disabled}
                        onChange={(values) => update('requested_supports', values)}
                    />
                </FormGridWide>
                {data.requested_supports.includes('other') ? (
                    <FormGridWide>
                        <TextAreaField
                            id="support-request-other-support"
                            name="other_support"
                            label="Outro apoio solicitado"
                            rows={2}
                            maxLength={1000}
                            value={data.other_support}
                            error={errors.other_support}
                            onChange={(value) => update('other_support', value)}
                        />
                    </FormGridWide>
                ) : null}
            </FormGrid>
        </FormSection>
    );
}
