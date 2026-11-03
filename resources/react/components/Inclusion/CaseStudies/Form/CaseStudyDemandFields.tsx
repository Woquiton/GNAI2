import { DateInputField, SelectInputField } from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import type { SelectFieldOption } from '@/components/Forms/SelectField/SelectField.types';
import { CASE_STUDY_TOUR_TARGETS } from '../caseStudyTours';
import type { CaseStudyRichTextSectionProps } from './CaseStudyForm.types';
import CaseStudyRichTextField from './CaseStudyRichTextField';

interface CaseStudyDemandFieldsProps extends CaseStudyRichTextSectionProps {
    demandOrigins: SelectFieldOption[];
}

/** Origem da demanda, data do estudo e resumo dos participantes. */
export default function CaseStudyDemandFields({
    demandOrigins,
    ...sectionProps
}: CaseStudyDemandFieldsProps): React.JSX.Element {
    const { form, errors, disabled } = sectionProps;

    return (
        <FormSection
            id="case-study-demand"
            tourTarget={CASE_STUDY_TOUR_TARGETS.demand}
            title="Identificação da Demanda"
            variant="inline"
            iconClass="fa fa-bullhorn"
        >
            <FormGrid columns={2}>
                <SelectInputField
                    id="case-study-demand-origin"
                    name="demand_origin"
                    label="Origem da demanda"
                    required
                    options={demandOrigins}
                    value={form.data.demand_origin}
                    error={errors.demand_origin}
                    disabled={disabled}
                    onChange={(value) => form.setData('demand_origin', value)}
                />
                <DateInputField
                    id="case-study-study-date"
                    name="study_date"
                    label="Data do Estudo de Caso"
                    hint="Data em que o Estudo de Caso foi realizado com os participantes."
                    hintLabel="Mais informações sobre a data do Estudo de Caso"
                    value={form.data.study_date}
                    error={errors.study_date}
                    disabled={disabled}
                    onChange={(value) => form.setData('study_date', value)}
                />
                <FormGridWide>
                    <CaseStudyRichTextField
                        {...sectionProps}
                        name="participants_summary"
                        label="Participantes (resumo)"
                        compact
                    />
                </FormGridWide>
            </FormGrid>
        </FormSection>
    );
}
