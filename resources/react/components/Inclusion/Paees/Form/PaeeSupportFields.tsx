import { RichTextField } from '@/components/Forms/FormFields/FormFields';
import FormGrid from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import ToggleControl from '@/components/Forms/ToggleControl/ToggleControl';
import InfoTooltip from '@/components/UI/InfoTooltip/InfoTooltip';
import type { PaeeBooleanField, PaeeFormSectionProps, PaeeTextField } from './PaeeForm.types';

const supportFields: Array<{
    toggle: PaeeBooleanField;
    toggleLabel: string;
    text: PaeeTextField;
    textLabel: string;
}> = [
    {
        toggle: 'support_professional_needed',
        toggleLabel: 'Necessita de profissional de apoio',
        text: 'support_professional_justification',
        textLabel: 'Justificativa do profissional de apoio',
    },
    {
        toggle: 'libras_interpreter_needed',
        toggleLabel: 'Necessita de tradutor/intérprete de Libras',
        text: 'libras_interpreter_justification',
        textLabel: 'Justificativa do intérprete de Libras',
    },
    {
        toggle: 'guide_interpreter_needed',
        toggleLabel: 'Necessita de guia-intérprete',
        text: 'guide_interpreter_justification',
        textLabel: 'Justificativa do guia-intérprete',
    },
];

/** Profissional de apoio, intérprete de Libras e guia-intérprete, com justificativas. */
export default function PaeeSupportFields({
    form,
    richText,
    toggle,
}: PaeeFormSectionProps): React.JSX.Element {
    return (
        <FormSection
            id="paee-supports"
            title="Apoios de Profissionais"
            titleAddon={
                <InfoTooltip
                    text="A necessidade de cada apoio é avaliada a partir do Estudo de Caso, sem exigir laudo médico."
                    label="Mais informações sobre apoios de profissionais"
                />
            }
            variant="inline"
            iconClass="fa fa-users"
        >
            <FormGrid columns={3}>
                {supportFields.map((field) => (
                    <div key={field.toggle}>
                        <ToggleControl {...toggle(field.toggle)} label={field.toggleLabel} />
                    </div>
                ))}
                {supportFields.map((field) => (
                    <div key={field.text}>
                        <RichTextField
                            {...richText(field.text)}
                            label={field.textLabel}
                            required={form.data[field.toggle]}
                        />
                    </div>
                ))}
            </FormGrid>
        </FormSection>
    );
}
