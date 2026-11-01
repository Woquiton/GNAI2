import { CheckboxListField } from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import type { SelectFieldOption } from '@/components/Forms/SelectField/SelectField.types';
import type { CaseStudyRichTextSectionProps } from './CaseStudyForm.types';
import CaseStudyRichTextField from './CaseStudyRichTextField';

interface CaseStudySupportFieldsProps extends CaseStudyRichTextSectionProps {
    neededSupports: SelectFieldOption[];
}

/** Aspectos favoráveis, potenciais, apoios necessários e sua justificativa. */
export default function CaseStudySupportFields({
    neededSupports,
    ...sectionProps
}: CaseStudySupportFieldsProps): React.JSX.Element {
    const { form, errors, disabled } = sectionProps;
    // O backend valida o array e cada opção (`needed_supports.0`); a primeira mensagem é exibida.
    const supportsError =
        errors.needed_supports ??
        Object.entries(errors).find(([key]) => key.startsWith('needed_supports.'))?.[1];

    return (
        <FormSection
            id="case-study-potentials"
            title="Potencialidades e Apoios"
            variant="inline"
            iconClass="fa fa-star-o"
        >
            <FormGrid columns={2}>
                <CaseStudyRichTextField
                    {...sectionProps}
                    name="favorable_aspects"
                    label="Aspectos favoráveis"
                    required
                />
                <CaseStudyRichTextField
                    {...sectionProps}
                    name="potentials_interests"
                    label="Potenciais e interesses"
                    required
                />
                <FormGridWide>
                    <CheckboxListField
                        id="case-study-needed-supports"
                        name="needed_supports"
                        label="Apoios necessários"
                        required
                        options={neededSupports}
                        value={form.data.needed_supports}
                        error={supportsError}
                        disabled={disabled}
                        onChange={(values) => form.setData('needed_supports', values)}
                    />
                </FormGridWide>
                <FormGridWide>
                    <CaseStudyRichTextField
                        {...sectionProps}
                        name="needed_supports_justification"
                        label="Justificativa dos apoios necessários"
                        compact
                    />
                </FormGridWide>
            </FormGrid>
        </FormSection>
    );
}
