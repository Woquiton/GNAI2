import ChoiceControl from '@/components/Forms/ChoiceControl/ChoiceControl';
import FieldError from '@/components/Forms/FormField/FieldError';
import { fieldDescribedBy } from '@/components/Forms/FormField/fieldDescription';
import { TextInputField } from '@/components/Forms/FormFields/FormFields';
import { FormStack } from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import { SETTINGS_TOUR_TARGETS } from '../settingsTours';
import type { MailSettingsFormState } from './useMailSettingsForm';

export default function MailInboxFields({
    form,
    available,
}: {
    form: MailSettingsFormState['form'];
    available: boolean;
}): React.JSX.Element {
    const id = 'mail-gmail-inbox-enabled';
    const error = form.errors.gmail_inbox_enabled;
    const showFolder = form.data.gmail_inbox_enabled || Boolean(form.errors.gmail_inbox_folder);

    function changeReceiving(checked: boolean): void {
        form.clearErrors('gmail_inbox_enabled', 'gmail_inbox_folder');
        form.setData((data) => ({
            ...data,
            gmail_inbox_enabled: checked,
            gmail_inbox_folder: data.gmail_inbox_folder?.trim() || 'INBOX',
        }));
    }

    return (
        <FormSection
            title="Respostas do Gmail"
            variant="inline"
            iconClass="fa fa-inbox"
            tourTarget={SETTINGS_TOUR_TARGETS.mailInbox}
        >
            <FormStack>
                <p id={`${id}-hint`}>
                    Importe para a Inbox as respostas aos e-mails enviados pelo Gnai. A leitura usa
                    a mesma conta Gmail e chave de aplicativo do envio, sem mover mensagens ou
                    marcá-las como lidas no Gmail. Outras mensagens da conta não são importadas. Os
                    usuários com permissão para consultar a Inbox poderão ler essas respostas.
                </p>
                {!available ? (
                    <p>O servidor precisa da extensão PHP IMAP para receber respostas.</p>
                ) : null}
                <ChoiceControl
                    id={id}
                    type="checkbox"
                    name="gmail_inbox_enabled"
                    tone="purple"
                    label="Importar respostas do Gmail"
                    checked={form.data.gmail_inbox_enabled ?? false}
                    invalid={Boolean(error)}
                    describedBy={fieldDescribedBy(id, { error, hint: true })}
                    onChange={changeReceiving}
                />
                <FieldError id={id} error={error} />
                {showFolder ? (
                    <TextInputField
                        id="mail-gmail-inbox-folder"
                        name="gmail_inbox_folder"
                        label="Pasta das respostas recebidas"
                        required
                        maxLength={255}
                        autoComplete="off"
                        value={form.data.gmail_inbox_folder ?? 'INBOX'}
                        error={form.errors.gmail_inbox_folder}
                        hint="Use INBOX para a caixa de entrada. Se um filtro move as respostas, informe a pasta que as recebe."
                        onChange={(value) => form.setData('gmail_inbox_folder', value)}
                    />
                ) : null}
                <p>
                    A consulta automática ocorre a cada minuto. Salvar não testa a conexão; use
                    Buscar respostas na Inbox para consultar agora.
                </p>
            </FormStack>
        </FormSection>
    );
}
