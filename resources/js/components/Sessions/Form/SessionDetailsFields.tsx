import { RichTextField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import type { SessionFormSectionProps } from './SessionForm.types';
import { SESSION_TOUR_TARGETS } from '../sessionTours';

interface SessionDetailsFieldsProps extends SessionFormSectionProps {
    editing: boolean;
    onEditorFailure: () => void;
}

/** Local e objetivo do agendamento. */
export default function SessionDetailsFields({
    form,
    errors,
    disabled,
    editing,
    onEditorFailure,
}: SessionDetailsFieldsProps): React.JSX.Element {
    return (
        <FormSection
            id="session-details"
            tourTarget={SESSION_TOUR_TARGETS.details}
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
                    <RichTextField
                        id="session-objective"
                        label="Objetivo do Agendamento"
                        required
                        defaultValue={form.data.session_objective}
                        height={120}
                        disabled={disabled}
                        error={errors.session_objective}
                        onLoadError={onEditorFailure}
                        onChange={(html) => form.setData('session_objective', html)}
                    />
                </FormGridWide>
            </FormGrid>
        </FormSection>
    );
}
