import { TextInputField } from '@/components/Forms/FormFields/FormFields';
import FormSection from '@/components/Forms/FormSection/FormSection';
import Button from '@/components/UI/Button/Button';
import { MAIL_HINTS } from './MailSettings.constants';
import type { MailSettingsFormState } from './useMailSettingsForm';

/**
 * Envio de um e-mail de teste com a configuração salva. Fica bloqueado enquanto houver alterações
 * não salvas; Enter no campo envia o teste em vez de salvar o formulário.
 */
export default function MailTestSection({
    state,
}: {
    state: MailSettingsFormState;
}): React.JSX.Element {
    const { testForm, testBlocked, sendTest } = state;
    const sending = testForm.processing;

    return (
        <FormSection
            id="mail-test"
            title="Enviar e-mail de teste"
            variant="inline"
            iconClass="fa fa-paper-plane"
        >
            <div className="mailSettings__test">
                <TextInputField
                    id="mail-test-recipient"
                    name="recipient"
                    type="email"
                    label="E-mail de destino"
                    maxLength={255}
                    autoComplete="email"
                    hint={MAIL_HINTS.recipient}
                    hintLabel="Mais informações sobre o e-mail de teste"
                    disabled={sending}
                    value={testForm.data.recipient}
                    error={testForm.errors.recipient}
                    onKeyDown={(event) => {
                        if (event.key !== 'Enter') {
                            return;
                        }

                        event.preventDefault();
                        sendTest();
                    }}
                    onChange={(value) => testForm.setData('recipient', value)}
                />
                <Button
                    type="button"
                    tone="dark-blue"
                    leftIconClass="fa fa-paper-plane"
                    label={sending ? 'Enviando...' : 'Enviar teste'}
                    title="Enviar e-mail de teste"
                    aria-label={sending ? 'Enviando e-mail de teste' : 'Enviar e-mail de teste'}
                    disabled={testBlocked}
                    onClick={sendTest}
                />
            </div>
        </FormSection>
    );
}
