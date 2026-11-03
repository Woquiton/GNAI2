import { DateInputField, SelectInputField } from '@/components/Forms/FormFields/FormFields';
import FormGrid from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import type { SelectFieldOption } from '@/components/Forms/SelectField/SelectField.types';
import { CASE_STUDY_TOUR_TARGETS } from '../caseStudyTours';
import type { CaseStudyFormSectionProps } from './CaseStudyForm.types';

interface CaseStudyAcceptanceFieldsProps extends CaseStudyFormSectionProps {
    acceptanceStatuses: SelectFieldOption[];
}

/** Status e data do aceite da família/estudante. */
export default function CaseStudyAcceptanceFields({
    form,
    errors,
    disabled,
    acceptanceStatuses,
}: CaseStudyAcceptanceFieldsProps): React.JSX.Element {
    return (
        <FormSection
            id="case-study-acceptance"
            tourTarget={CASE_STUDY_TOUR_TARGETS.acceptance}
            title="Aceite da Família/Estudante"
            variant="inline"
            iconClass="fa fa-thumbs-o-up"
        >
            <FormGrid columns={2}>
                <SelectInputField
                    id="case-study-acceptance-status"
                    name="acceptance_status"
                    label="Status de aceite"
                    required
                    options={acceptanceStatuses}
                    value={form.data.acceptance_status}
                    error={errors.acceptance_status}
                    disabled={disabled}
                    onChange={(value) => form.setData('acceptance_status', value)}
                />
                <DateInputField
                    id="case-study-acceptance-date"
                    name="acceptance_date"
                    label="Data do aceite"
                    value={form.data.acceptance_date}
                    error={errors.acceptance_date}
                    disabled={disabled}
                    onChange={(value) => form.setData('acceptance_date', value)}
                />
            </FormGrid>
        </FormSection>
    );
}
