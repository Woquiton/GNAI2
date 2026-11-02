import EvidenceUpload from '@/components/Forms/EvidenceUpload/EvidenceUpload';
import {
    DateInputField,
    RichTextField,
    SelectInputField,
} from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormStack } from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import type { BarrierOption } from '../Barriers.types';
import type {
    BarrierEditorField,
    BarrierFormData,
    BarrierFormSectionProps,
} from './BarrierForm.types';

interface BarrierInspectionFieldsProps extends BarrierFormSectionProps {
    editing: boolean;
    barrierStatuses: BarrierOption[];
    onEditorFailure: (field: BarrierEditorField) => void;
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
    onEditorFailure,
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
                <RichTextField
                    id="barrier-inspection-description"
                    label={
                        editing ? 'Parecer Técnico / Notas' : 'Parecer Técnico / Notas da Vistoria'
                    }
                    defaultValue={form.data.inspection.description}
                    height={120}
                    disabled={disabled}
                    error={errors['inspection.description']}
                    onLoadError={() => onEditorFailure('inspection.description')}
                    onChange={(description) => updateInspection({ description })}
                />
            </FormStack>
        </FormSection>
    );
}
