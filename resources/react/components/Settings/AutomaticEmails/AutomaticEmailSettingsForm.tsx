import FormActions from '@/components/Forms/FormActions/FormActions';
import FieldError from '@/components/Forms/FormField/FieldError';
import { fieldDescribedBy } from '@/components/Forms/FormField/fieldDescription';
import { FormStack } from '@/components/Forms/FormGrid/FormGrid';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import FormSection from '@/components/Forms/FormSection/FormSection';
import ToggleControl from '@/components/Forms/ToggleControl/ToggleControl';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import { settingsCancelUrl } from '../Settings.routes';
import type { AutomaticEmailSettingsProps } from '../Settings.types';
import { SETTINGS_TOUR_TARGETS } from '../settingsTours';
import { useAutomaticEmailSettingsForm } from './useAutomaticEmailSettingsForm';

export default function AutomaticEmailSettingsForm(
    props: AutomaticEmailSettingsProps,
): React.JSX.Element {
    const { form, formRef, errors, disabled, save, changeEvent } = useAutomaticEmailSettingsForm(props);

    return (
        <FormLayout
            ref={formRef}
            aria-label="Configurações de e-mails automáticos"
            aria-busy={form.processing}
            onSubmit={(event) => {
                event.preventDefault();
                save();
            }}
        >
            <CardBox>
                <fieldset
                    disabled={disabled}
                    aria-invalid={Boolean(errors.events)}
                    aria-describedby={fieldDescribedBy('automatic-email-events', {
                        error: errors.events,
                    })}
                >
                    <FormSection
                        id="automatic-email-events"
                        title="E-mails automáticos"
                        variant="inline"
                        iconClass="fa fa-paper-plane"
                        tourTarget={SETTINGS_TOUR_TARGETS.automaticEmailEvents}
                        description="Ative os avisos que devem ser enviados para todas as novas operações do evento escolhido. O envio acontece em segundo plano. Uma falha no e-mail não impede salvar a operação. As mensagens e falhas ficam na Inbox."
                    >
                        <FieldError id="automatic-email-events" error={errors.events} />
                        <FormStack>
                            {props.groups.map((group) => (
                                <fieldset key={group.label}>
                                    <legend>{group.label}</legend>
                                    <FormStack>
                                        {group.options.map((option) => {
                                            const id = `automatic-email-${option.value}`;
                                            const error = errors[`events.${option.value}`];

                                            return (
                                                <div key={option.value}>
                                                    <ToggleControl
                                                        id={id}
                                                        name={`events[${option.value}]`}
                                                        label={option.label}
                                                        checked={form.data.events[option.value]}
                                                        disabled={disabled}
                                                        invalid={Boolean(error)}
                                                        describedBy={fieldDescribedBy(id, { error })}
                                                        onChange={(checked) =>
                                                            changeEvent(option.value, checked)
                                                        }
                                                    />
                                                    <FieldError id={id} error={error} />
                                                </div>
                                            );
                                        })}
                                    </FormStack>
                                </fieldset>
                            ))}
                            <p>
                                As opções de agendamentos começam desativadas. Os avisos de
                                empréstimos e fila de espera começam ativados. Alterações valem para
                                as próximas operações e não cancelam mensagens já preparadas.
                            </p>
                            <p>
                                Links de acesso, recuperação de senha e mensagens escritas na Inbox
                                continuam disponíveis independentemente destas opções.
                            </p>
                        </FormStack>
                    </FormSection>
                </fieldset>
            </CardBox>
            <FormActions
                status={form.processing ? 'Salvando configurações…' : undefined}
                tourTarget={SETTINGS_TOUR_TARGETS.automaticEmailActions}
            >
                <Button
                    href={settingsCancelUrl}
                    tone="cancel"
                    label="Cancelar"
                    disabled={form.processing}
                />
                {props.canUpdate ? (
                    <Button type="submit" tone="save" label="Salvar" disabled={form.processing} />
                ) : null}
            </FormActions>
        </FormLayout>
    );
}
