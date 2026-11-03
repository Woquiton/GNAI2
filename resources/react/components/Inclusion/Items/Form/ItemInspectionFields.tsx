import { optionsFromRecord } from '@/components/Forms/FormFields/fieldOptions';
import EvidenceUpload from '@/components/Forms/EvidenceUpload/EvidenceUpload';
import {
    DateInputField,
    RichTextField,
    SelectInputField,
} from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import type { ItemFormOptions } from '../Items.types';
import { ITEM_TOUR_TARGETS } from '../itemTours';
import type { ItemFormData, ItemFormMode, ItemFormSectionProps } from './ItemForm.types';

interface ItemInspectionFieldsProps extends ItemFormSectionProps {
    mode: ItemFormMode;
    options: Pick<ItemFormOptions, 'inspectionTypes' | 'conservationStates'>;
    onEditorFailure: (message: string) => void;
}

/** Vistoria registrada junto do cadastro (inicial) ou da edição (nova vistoria). */
export default function ItemInspectionFields({
    form,
    errors,
    disabled,
    mode,
    options,
    onEditorFailure,
}: ItemInspectionFieldsProps): React.JSX.Element {
    function updateInspection(patch: Partial<ItemFormData['inspection']>): void {
        form.setData((data) => ({ ...data, inspection: { ...data.inspection, ...patch } }));
    }

    return (
        <FormSection
            id="item-inspection-form"
            title={mode === 'create' ? 'Vistoria Inicial' : 'Nova Vistoria'}
            variant="inline"
            iconClass="fa fa-search"
            tourTarget={ITEM_TOUR_TARGETS.inspection}
        >
            <FormGrid>
                <SelectInputField
                    id="item-inspection-type"
                    name="inspection[type]"
                    label="Tipo de Inspeção"
                    required
                    options={optionsFromRecord(options.inspectionTypes)}
                    value={form.data.inspection.type}
                    error={errors['inspection.type']}
                    onChange={(type) => updateInspection({ type })}
                />
                <DateInputField
                    id="item-inspection-date"
                    name="inspection[date]"
                    label="Data da Inspeção"
                    required
                    disabled={disabled}
                    value={form.data.inspection.date}
                    error={errors['inspection.date']}
                    onChange={(date) => updateInspection({ date })}
                />
                <SelectInputField
                    id="item-conservation"
                    name="conservation_state"
                    label="Estado de Conservação"
                    required
                    options={optionsFromRecord(options.conservationStates)}
                    value={form.data.conservation_state}
                    error={errors.conservation_state}
                    onChange={(value) => form.setData('conservation_state', value)}
                />
                <EvidenceUpload
                    id="item-evidences"
                    name="inspection[evidences][]"
                    disabled={disabled}
                    files={form.data.inspection.evidences}
                    error={errors['inspection.evidences'] ?? errors['inspection.evidences.0']}
                    onChange={(evidences) => {
                        form.clearErrors('inspection.evidences');
                        updateInspection({ evidences });
                    }}
                />
                <FormGridWide>
                    <RichTextField
                        id="item-inspection-description"
                        label="Parecer Técnico"
                        defaultValue={form.data.inspection.description}
                        height={120}
                        disabled={disabled}
                        error={errors['inspection.description']}
                        onLoadError={() =>
                            onEditorFailure(
                                'Não foi possível carregar o editor de parecer técnico. Atualize a página e tente novamente.',
                            )
                        }
                        onChange={(description) => updateInspection({ description })}
                    />
                </FormGridWide>
            </FormGrid>
        </FormSection>
    );
}
