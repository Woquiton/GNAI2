import { TextAreaField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import type { SessionFormSectionProps } from './SessionForm.types';

interface SessionDetailsFieldsProps extends SessionFormSectionProps {
    editing: boolean;
}

/** Local e objetivo do agendamento. */
export default function SessionDetailsFields({
    form,
    errors,
    disabled,
    editing,
}: SessionDetailsFieldsProps): React.JSX.Element {
    return (
        <FormSection
            id="session-details"
            title={editing ? 'Detalhes Adicionais' : 'Detalhes do Atendimento'}
            variant="inline"
            iconClass="fa fa-info-circle"
        >
            <FormGrid columns={2}>
                <TextInputField
                    id="session-location"
                    name="location"
                    label="Local"
                    required
                    maxLength={255}
                    disabled={disabled}
                    value={form.data.location}
                    error={errors.location}
                    fieldClassName={editing ? 'formGrid__wide' : undefined}
                    onChange={(value) => form.setData('location', value)}
                />
                <FormGridWide>
                    <TextAreaField
                        id="session-objective"
                        name="session_objective"
                        label="Objetivo do Agendamento"
                        required
                        rows={3}
                        disabled={disabled}
                        value={form.data.session_objective}
                        error={errors.session_objective}
                        onChange={(value) => form.setData('session_objective', value)}
                    />
                </FormGridWide>
            </FormGrid>
        </FormSection>
    );
}
