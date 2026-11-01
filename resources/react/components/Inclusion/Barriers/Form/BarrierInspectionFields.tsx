import EvidenceUpload from '@/components/Forms/EvidenceUpload/EvidenceUpload';
import {
    DateInputField,
    SelectInputField,
    TextAreaField,
} from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormStack } from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import type { BarrierOption } from '../Barriers.types';
import type { BarrierFormData, BarrierFormSectionProps } from './BarrierForm.types';

interface BarrierInspectionFieldsProps extends BarrierFormSectionProps {
    editing: boolean;
    barrierStatuses: BarrierOption[];
}

/** Primeiro erro das evidências (`inspection.evidences` ou `inspection.evidences.N`). */
function evidenceError(errors: Record<string, string | undefined>): string | undefined {
    return Object.entries(errors).find(([key]) => key.startsWith('inspection.evidences'))?.[1];
}

/** Vistoria registrada junto do relato (inicial) ou da edição (periódica). */
export default function BarrierInspectionFields({
    form,
    errors,
    disabled,
    editing,
    barrierStatuses,
}: BarrierInspectionFieldsProps): React.JSX.Element {
    function updateInspection(patch: Partial<BarrierFormData['inspection']>): void {
        form.setData((current) => ({
            ...current,
            inspection: { ...current.inspection, ...patch },
        }));
    }

    return (
        <FormSection
            id="barrier-inspection"
            title={editing ? 'Vistoria Periódica' : 'Vistoria Inicial'}
            variant="inline"
            iconClass="fa fa-clipboard"
        >
            <FormStack>
                <FormGrid>
                    <SelectInputField
                        id="barrier-status"
                        name="status"
                        label={editing ? 'Status Atual' : 'Status Inicial'}
                        required={!editing}
                        options={barrierStatuses}
                        disabled={disabled}
                        value={form.data.status}
                        error={errors.status}
                        onChange={(value) => form.setData('status', value)}
                    />
                    <DateInputField
                        id="barrier-inspection-date"
                        name="inspection[date]"
                        label="Data da Vistoria"
                        required
                        disabled={disabled}
                        value={form.data.inspection.date}
                        error={errors['inspection.date']}
                        onChange={(date) => updateInspection({ date })}
                    />
                </FormGrid>
                <EvidenceUpload
                    id="barrier-evidences"
                    name="inspection[evidences][]"
                    files={form.data.inspection.evidences}
                    error={evidenceError(errors)}
                    disabled={disabled}
                    onChange={(evidences) => updateInspection({ evidences })}
                />
                <TextAreaField
                    id="barrier-inspection-description"
                    name="inspection[description]"
                    label={
                        editing ? 'Parecer Técnico / Notas' : 'Parecer Técnico / Notas da Vistoria'
                    }
                    rows={3}
                    maxLength={1000}
                    placeholder="Descreva detalhes técnicos sobre a obstrução ou estado do local..."
                    disabled={disabled}
                    value={form.data.inspection.description}
                    error={errors['inspection.description']}
                    onChange={(description) => updateInspection({ description })}
                />
            </FormStack>
        </FormSection>
    );
}
