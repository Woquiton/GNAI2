import FormActions from '@/components/Forms/FormActions/FormActions';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import { settingsCancelUrl } from '../Settings.routes';
import { SETTINGS_TOUR_TARGETS } from '../settingsTours';
import type { MailSettingsProps } from '../Settings.types';
import MailConfigurationStatus from './MailConfigurationStatus';
import MailBounceFields from './MailBounceFields';
import MailInboxFields from './MailInboxFields';
import MailFolderSyncFields from './MailFolderSyncFields';
import MailSenderFields from './MailSenderFields';
import MailServerFields from './MailServerFields';
import MailTestSection from './MailTestSection';
import { useMailSettingsForm } from './useMailSettingsForm';
import './MailSettings.css';

function submissionStatus(saving: boolean, testing: boolean): string {
    if (saving) {
        return 'Salvando configurações de e-mail...';
    }

    return testing ? 'Enviando e-mail de teste...' : '';
}

/** Servidor de envio, remetente e e-mail de teste das configurações de e-mail. */
export default function MailSettingsForm({
    mail,
    transports,
    encryptions,
    canUpdate,
    gmailBouncesAvailable,
    gmailFoldersAvailable,
}: MailSettingsProps): React.JSX.Element {
    const state = useMailSettingsForm({ mail, canUpdate });
    const { form, testForm, formRef, save } = state;
    const disabled = !canUpdate || form.processing;

    return (
        <FormLayout
            ref={formRef}
            aria-label="Configurações de e-mail"
            aria-busy={form.processing || testForm.processing}
            onSubmit={(event) => {
                event.preventDefault();
                save();
            }}
        >
            <CardBox>
                <MailConfigurationStatus mail={mail} />
                <fieldset disabled={disabled}>
                    <MailServerFields
                        state={state}
                        transports={transports}
                        encryptions={encryptions}
                        hasPassword={mail.has_password}
                        disabled={disabled}
                    />
                    <MailSenderFields form={form} />
                    <MailBounceFields form={form} available={gmailBouncesAvailable} />
                    <MailInboxFields form={form} available={gmailBouncesAvailable} />
                    <MailFolderSyncFields form={form} available={gmailFoldersAvailable} />
                    {canUpdate ? <MailTestSection state={state} /> : null}
                </fieldset>
            </CardBox>
            <FormActions
                status={submissionStatus(form.processing, testForm.processing)}
                tourTarget={SETTINGS_TOUR_TARGETS.mailActions}
            >
                <Button
                    href={settingsCancelUrl}
                    tone="cancel"
                    label="Cancelar"
                    title="Cancelar e voltar ao início"
                    aria-label="Cancelar e voltar ao início"
                    disabled={form.processing}
                />
                {canUpdate ? (
                    <Button
                        type="submit"
                        tone="save"
                        leftIconClass="fa fa-check"
                        label="Salvar"
                        title="Salvar configurações de e-mail"
                        aria-label={
                            form.processing
                                ? 'Salvando configurações de e-mail'
                                : 'Salvar configurações de e-mail'
                        }
                        disabled={form.processing || testForm.processing}
                    />
                ) : null}
            </FormActions>
        </FormLayout>
    );
}
