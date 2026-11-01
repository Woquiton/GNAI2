import { TextInputField } from '@/components/Forms/FormFields/FormFields';
import FormGrid from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import { MAIL_HINTS } from './MailSettings.constants';
import type { MailSettingsFormState } from './useMailSettingsForm';

/** Endereço e nome que os destinatários veem como remetente. */
export default function MailSenderFields({
    form,
}: {
    form: MailSettingsFormState['form'];
}): React.JSX.Element {
    return (
        <FormSection id="mail-sender" title="Remetente" variant="inline" iconClass="fa fa-envelope">
            <FormGrid>
                <TextInputField
                    id="mail-from_address"
                    name="from_address"
                    type="email"
                    label="E-mail de envio"
                    required
                    maxLength={255}
                    autoComplete="off"
                    hint={MAIL_HINTS.fromAddress}
                    hintLabel="Mais informações sobre e-mail de envio"
                    value={form.data.from_address}
                    error={form.errors.from_address}
                    onChange={(value) => form.setData('from_address', value)}
                />
                <TextInputField
                    id="mail-from_name"
                    name="from_name"
                    label="Nome do remetente"
                    required
                    maxLength={255}
                    autoComplete="off"
                    hint={MAIL_HINTS.fromName}
                    hintLabel="Mais informações sobre nome do remetente"
                    value={form.data.from_name}
                    error={form.errors.from_name}
                    onChange={(value) => form.setData('from_name', value)}
                />
            </FormGrid>
        </FormSection>
    );
}
