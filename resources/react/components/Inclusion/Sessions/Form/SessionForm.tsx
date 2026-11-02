import FormActions from '@/components/Forms/FormActions/FormActions';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import FormSection from '@/components/Forms/FormSection/FormSection';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import { sessionUrls } from '../Sessions.routes';
import SessionAvailability from './SessionAvailability';
import SessionDetailsFields from './SessionDetailsFields';
import SessionEditSummary from './SessionEditSummary';
import type { SessionFormProps } from './SessionForm.types';
import SessionNotificationModal from './SessionNotificationModal';
import SessionParticipantsFields from './SessionParticipantsFields';
import { useSessionForm } from './useSessionForm';
import './SessionForm.css';

/** Cadastro e edição de agendamentos com disponibilidade do dia e aviso opcional por e-mail. */
export default function SessionForm(props: SessionFormProps): React.JSX.Element {
    const state = useSessionForm(props);
    const { form, errors, session, editing } = state;
    const sectionProps = { form, errors, disabled: form.processing };
    const cancelHref = session ? sessionUrls.show(session.id) : sessionUrls.index;
    const participantsSection =
        props.mode === 'create' ? (
            <SessionParticipantsFields {...sectionProps} options={props} state={state} />
        ) : (
            <SessionEditSummary
                {...sectionProps}
                options={props}
                onStartTimeChange={state.changeStartTime}
            />
        );
    const notificationTitle = editing ? 'Confirmar Alterações' : 'Confirmar Novo Agendamento';
    const notificationMessage = editing
        ? 'Deseja enviar um e-mail aos participantes sobre as alterações deste agendamento?'
        : 'Deseja enviar um e-mail aos participantes sobre este agendamento?';

    return (
        <>
            <FormLayout
                ref={state.formRef}
                onSubmit={state.handleSubmit}
                aria-label={editing ? 'Editar agendamento' : 'Cadastrar agendamento'}
                aria-busy={form.processing}
            >
                <CardBox>
                    <fieldset disabled={form.processing}>
                        {participantsSection}
                        <FormSection
                            id="session-availability"
                            title="Disponibilidade do Dia"
                            variant="inline"
                            iconClass="fa fa-clock-o"
                        >
                            <SessionAvailability
                                date={form.data.session_date}
                                professionalId={form.data.professional_id}
                                studentIds={form.data.student_ids}
                                selectedTime={form.data.start_time}
                                disabled={form.processing}
                                onSelect={state.changeStartTime}
                            />
                        </FormSection>
                        <SessionDetailsFields
                            {...sectionProps}
                            editing={editing}
                            onEditorFailure={state.reportObjectiveEditorFailure}
                        />
                    </fieldset>
                </CardBox>
                <FormActions status={form.processing ? 'Salvando agendamento...' : undefined}>
                    <Button
                        href={cancelHref}
                        tone="cancel"
                        label="Cancelar"
                        title="Cancelar e voltar"
                        aria-label="Cancelar e voltar"
                        disabled={form.processing}
                    />
                    <Button
                        type="submit"
                        tone="save"
                        leftIconClass="fa fa-check"
                        label="Salvar"
                        title="Salvar agendamento"
                        aria-label={form.processing ? 'Salvando agendamento' : 'Salvar agendamento'}
                        disabled={form.processing || state.editorFailed}
                    />
                </FormActions>
            </FormLayout>
            <SessionNotificationModal
                open={state.confirmOpen}
                title={notificationTitle}
                message={notificationMessage}
                onClose={state.closeConfirmation}
                onChoose={state.chooseNotification}
            />
        </>
    );
}
