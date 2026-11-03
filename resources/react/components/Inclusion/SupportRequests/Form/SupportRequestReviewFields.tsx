import {
    SelectInputField,
    TextAreaField,
    TextInputField,
} from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import InfoTooltip from '@/components/UI/InfoTooltip/InfoTooltip';
import type { SupportRequestOption } from '../SupportRequests.types';
import type { SupportRequestFieldsProps } from './SupportRequestForm.types';

export default function SupportRequestReviewFields({
    data,
    errors,
    disabled,
    update,
    statuses,
    editing,
}: SupportRequestFieldsProps & {
    statuses: SupportRequestOption[];
    editing: boolean;
}): React.JSX.Element {
    const statusLabel = statuses.find((status) => status.value === data.status)?.label ?? '';

    return (
        <FormSection
            id="support-request-review"
            title="Análise e encaminhamentos"
            variant="inline"
            iconClass="fa fa-clipboard"
            titleAddon={
                <InfoTooltip
                    label="Mais informações sobre análise e encaminhamentos"
                    text="Toda nova solicitação começa como Recebida. Na edição, a equipe pode alterar para Em análise, Encaminhada ou Concluída. Esse andamento é independente do diagnóstico e da situação do aluno."
                />
            }
        >
            <FormGrid columns={2}>
                {editing ? (
                    <SelectInputField
                        id="support-request-status"
                        name="status"
                        label="Situação da solicitação"
                        required
                        options={statuses}
                        value={data.status}
                        error={errors.status}
                        disabled={disabled}
                        onChange={(value) => update('status', value)}
                    />
                ) : (
                    <TextInputField
                        id="support-request-status"
                        name="status"
                        label="Situação da solicitação"
                        value={statusLabel}
                        readOnly
                        disabled={disabled}
                    />
                )}
                {editing ? (
                    <>
                        <FormGridWide>
                            <TextAreaField
                                id="support-request-analysis"
                                name="analysis_notes"
                                label="Análise inicial da equipe"
                                rows={4}
                                maxLength={10000}
                                value={data.analysis_notes}
                                error={errors.analysis_notes}
                                onChange={(value) => update('analysis_notes', value)}
                            />
                        </FormGridWide>
                        <FormGridWide>
                            <TextAreaField
                                id="support-request-referrals"
                                name="referrals"
                                label="Providências e encaminhamentos realizados"
                                rows={4}
                                maxLength={10000}
                                value={data.referrals}
                                error={errors.referrals}
                                onChange={(value) => update('referrals', value)}
                            />
                        </FormGridWide>
                    </>
                ) : null}
            </FormGrid>
        </FormSection>
    );
}
