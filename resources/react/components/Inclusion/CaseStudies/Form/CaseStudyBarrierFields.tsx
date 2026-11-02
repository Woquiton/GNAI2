import FormField from '@/components/Forms/FormField/FormField';
import { fieldDescribedBy } from '@/components/Forms/FormField/fieldDescription';
import { TextAreaField } from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import RemovableField from '@/components/Forms/RemovableField/RemovableField';
import RepeaterField from '@/components/Forms/RepeaterField/RepeaterField';
import SelectField from '@/components/Forms/SelectField/SelectField';
import type { SelectFieldOption } from '@/components/Forms/SelectField/SelectField.types';
import type { CaseStudyBarrierInput } from '../CaseStudies.types';
import type { CaseStudyFormSectionProps } from './CaseStudyForm.types';

interface CaseStudyBarrierFieldsProps extends CaseStudyFormSectionProps {
    barrierTypes: SelectFieldOption[];
}

const emptyBarrier = (): CaseStudyBarrierInput => ({
    type: '',
    observed_situation: '',
    participation_implication: '',
});

/** Barreiras identificadas: categoria, situação observada e implicação na participação. */
export default function CaseStudyBarrierFields({
    form,
    errors,
    disabled,
    barrierTypes,
}: CaseStudyBarrierFieldsProps): React.JSX.Element {
    function renderBarrier(
        barrier: CaseStudyBarrierInput,
        index: number,
        update: (patch: Partial<CaseStudyBarrierInput>) => void,
        remove: () => void,
    ): React.JSX.Element {
        const prefix = `barriers.${index}`;
        const idPrefix = `case-study-barriers-${index}`;
        const typeId = `${idPrefix}-type`;
        const typeError = errors[`${prefix}.type`];

        return (
            <FormGrid columns={2}>
                <FormGridWide>
                    {/* O botão de remover acompanha a categoria, por isso o controle é isolado. */}
                    <FormField
                        id={typeId}
                        label="Categoria de barreira"
                        requiredIndicator
                        error={typeError}
                    >
                        <RemovableField
                            removeLabel={`Remover barreira ${index + 1}`}
                            disabled={disabled}
                            onRemove={remove}
                        >
                            <SelectField
                                id={typeId}
                                name={`barriers[${index}][type]`}
                                label="Categoria de barreira"
                                required
                                value={barrier.type}
                                options={barrierTypes}
                                invalid={Boolean(typeError)}
                                aria-describedby={fieldDescribedBy(typeId, { error: typeError })}
                                disabled={disabled}
                                onChange={(event) => update({ type: event.target.value })}
                            />
                        </RemovableField>
                    </FormField>
                </FormGridWide>
                <TextAreaField
                    id={`${idPrefix}-observed-situation`}
                    name={`barriers[${index}][observed_situation]`}
                    label="Situação observada"
                    required
                    rows={2}
                    value={barrier.observed_situation}
                    error={errors[`${prefix}.observed_situation`]}
                    onChange={(value) => update({ observed_situation: value })}
                />
                <TextAreaField
                    id={`${idPrefix}-participation-implication`}
                    name={`barriers[${index}][participation_implication]`}
                    label="Implicação na participação"
                    required
                    rows={2}
                    value={barrier.participation_implication}
                    error={errors[`${prefix}.participation_implication`]}
                    onChange={(value) => update({ participation_implication: value })}
                />
            </FormGrid>
        );
    }

    return (
        <FormSection
            id="case-study-barriers"
            title="Barreiras Identificadas"
            variant="inline"
            iconClass="fa fa-ban"
        >
            <RepeaterField<CaseStudyBarrierInput>
                items={form.data.barriers}
                onChange={(barriers) => form.setData('barriers', barriers)}
                createItem={emptyBarrier}
                itemLabel={(index) => `Barreira ${index + 1}`}
                addLabel="Barreira"
                emptyMessage="Nenhuma barreira adicionada."
                disabled={disabled}
                removePlacement="field"
                renderItem={renderBarrier}
            />
        </FormSection>
    );
}
