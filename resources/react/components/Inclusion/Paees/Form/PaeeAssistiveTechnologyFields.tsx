import { RichTextField } from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import ToggleControl from '@/components/Forms/ToggleControl/ToggleControl';
import InfoTooltip from '@/components/UI/InfoTooltip/InfoTooltip';
import type { PaeeFormSectionProps } from './PaeeForm.types';

const PORTABLE_DEVICE_LABEL = 'A tecnologia assistiva é um dispositivo digital portátil';
const AVAILABILITY_LABEL = 'Capacidade de disponibilização da TA';

/** Necessidade de TA e CAA, observações, disponibilização e parecer sobre TA portátil. */
export default function PaeeAssistiveTechnologyFields({
    form,
    richText,
    toggle,
}: PaeeFormSectionProps): React.JSX.Element {
    return (
        <FormSection
            id="paee-assistive-technology"
            title="Tecnologia Assistiva e Comunicação Aumentativa e Alternativa (CAA)"
            variant="inline"
            iconClass="fa fa-wheelchair"
        >
            <FormGrid columns={2}>
                <ToggleControl
                    {...toggle('assistive_technology_needed')}
                    label="Necessita de tecnologia assistiva"
                />
                <ToggleControl
                    {...toggle('caa_needed')}
                    label="Necessita de Comunicação Aumentativa e Alternativa (CAA)"
                />
                <RichTextField
                    {...richText('assistive_technology_notes')}
                    label="Observações sobre tecnologia assistiva"
                    required={form.data.assistive_technology_needed}
                />
                <RichTextField
                    {...richText('caa_notes')}
                    label="Observações sobre CAA"
                    required={form.data.caa_needed}
                />
                <FormGridWide>
                    <RichTextField
                        {...richText('assistive_technology_availability_capacity')}
                        label={AVAILABILITY_LABEL}
                        hint="Avalie se a escola tem condições de disponibilizar a tecnologia assistiva indicada (equipamento próprio, empréstimo, aquisição etc.)."
                        hintLabel={`Mais informações sobre ${AVAILABILITY_LABEL.toLowerCase()}`}
                    />
                </FormGridWide>
                <ToggleControl
                    {...toggle('is_assistive_technology_portable_digital_device')}
                    label={PORTABLE_DEVICE_LABEL}
                    labelAddon={
                        <InfoTooltip
                            text="Marque se a TA indicada for um dispositivo digital portátil (tablet, notebook etc.); exige parecer pedagógico ao lado."
                            label={`Mais informações sobre ${PORTABLE_DEVICE_LABEL.toLowerCase()}`}
                        />
                    }
                />
                <RichTextField
                    {...richText('assistive_technology_pedagogical_opinion')}
                    label="Parecer pedagógico sobre a TA portátil"
                    required={form.data.is_assistive_technology_portable_digital_device}
                />
            </FormGrid>
        </FormSection>
    );
}
