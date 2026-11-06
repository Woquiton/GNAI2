import ChoiceControl from '@/components/Forms/ChoiceControl/ChoiceControl';
import FieldError from '@/components/Forms/FormField/FieldError';
import { fieldDescribedBy } from '@/components/Forms/FormField/fieldDescription';
import FormSection from '@/components/Forms/FormSection/FormSection';
import { SETTINGS_TOUR_TARGETS } from '../settingsTours';
import type { MailSettingsFormState } from './useMailSettingsForm';

export default function MailFolderSyncFields({
    form,
    available,
}: {
    form: MailSettingsFormState['form'];
    available: boolean;
}): React.JSX.Element {
    const id = 'mail-gmail-folders-enabled';
    const error = form.errors.gmail_folders_enabled;

    return (
        <FormSection
            title="Pastas do Gmail"
            variant="inline"
            iconClass="fa fa-folder"
            tourTarget={SETTINGS_TOUR_TARGETS.mailFolders}
        >
            <p id={`${id}-hint`}>
                Sincronize Spam, Lixeira, Arquivar e Restaurar com a conta Gmail desta instalação.
                As alterações de pasta passam a ser compartilhadas e afetam também o Gmail.
                Estrelas, leitura e marcadores continuam pessoais no Gnai. Mensagens ainda não
                enviadas continuam com organização local.
            </p>
            <ChoiceControl
                id={id}
                name="gmail_folders_enabled"
                type="checkbox"
                label="Sincronizar pastas com o Gmail"
                tone="purple"
                checked={form.data.gmail_folders_enabled}
                invalid={Boolean(error)}
                describedBy={fieldDescribedBy(id, { error, hint: true })}
                onChange={(checked) => form.setData('gmail_folders_enabled', checked)}
            />
            <FieldError id={id} error={error} />
            {!available ? <p>O servidor precisa de PHP cURL com suporte a IMAPS.</p> : null}
            <p>
                Mudanças feitas no Gmail são consultadas a cada minuto, em lotes. Use Sincronizar
                pastas na Inbox para consultar agora. As pastas são identificadas automaticamente,
                inclusive quando a conta está em outro idioma.
            </p>
        </FormSection>
    );
}
