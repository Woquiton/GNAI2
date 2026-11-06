import ChoiceControl from '@/components/Forms/ChoiceControl/ChoiceControl';
import FieldError from '@/components/Forms/FormField/FieldError';
import { fieldDescribedBy } from '@/components/Forms/FormField/fieldDescription';
import { TextInputField } from '@/components/Forms/FormFields/FormFields';
import { FormStack } from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import { SETTINGS_TOUR_TARGETS } from '../settingsTours';
import type { MailSettingsFormState } from './useMailSettingsForm';

export default function MailBounceFields({
    form,
    available,
}: {
    form: MailSettingsFormState['form'];
    available: boolean;
}): React.JSX.Element {
    const id = 'mail-gmail-bounces-enabled';
    const error = form.errors.gmail_bounces_enabled;
    const showFolder = form.data.gmail_bounces_enabled || Boolean(form.errors.gmail_bounces_folder);

    function changeMonitoring(checked: boolean): void {
        form.clearErrors('gmail_bounces_enabled', 'gmail_bounces_folder');
        form.setData((data) => ({
            ...data,
            gmail_bounces_enabled: checked,
            gmail_bounces_folder: data.gmail_bounces_folder.trim() || 'INBOX',
        }));
    }

    return (
        <FormSection
            title="Rejeições do Gmail"
            variant="inline"
            iconClass="fa fa-exclamation-triangle"
            tourTarget={SETTINGS_TOUR_TARGETS.mailBounces}
        >
            <FormStack>
                <p id={`${id}-hint`}>
                    Com Gmail / Google Workspace, use a mesma conta e chave de aplicativo do envio
                    para identificar mensagens não entregues. A conta precisa permitir leitura por
                    IMAP. A consulta ocorre a cada cinco minutos, sem apagar mensagens ou marcá-las
                    como lidas. Salvar esta opção não verifica a conexão com a caixa de e-mail.
                </p>
                {!available ? (
                    <p>
                        O servidor precisa da extensão PHP IMAP para habilitar esta opção. Solicite
                        a atualização ao responsável pela instalação.
                    </p>
                ) : null}
                <ChoiceControl
                    id={id}
                    name="gmail_bounces_enabled"
                    type="checkbox"
                    tone="primary"
                    label="Monitorar rejeições do Gmail"
                    checked={form.data.gmail_bounces_enabled}
                    invalid={Boolean(error)}
                    describedBy={fieldDescribedBy(id, { error, hint: true })}
                    onChange={changeMonitoring}
                />
                <FieldError id={id} error={error} />
                {showFolder ? (
                    <TextInputField
                        id="mail-gmail-bounces-folder"
                        name="gmail_bounces_folder"
                        label="Pasta dos avisos de rejeição"
                        required
                        maxLength={255}
                        autoComplete="off"
                        hint="Use INBOX para a caixa de entrada. Se um filtro move os avisos, informe o nome da pasta que os recebe."
                        value={form.data.gmail_bounces_folder}
                        error={form.errors.gmail_bounces_folder}
                        onChange={(value) => form.setData('gmail_bounces_folder', value)}
                    />
                ) : null}
            </FormStack>
        </FormSection>
    );
}
