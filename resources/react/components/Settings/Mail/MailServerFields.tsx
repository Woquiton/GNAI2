import { optionsFromRecord, SelectInputField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormStack } from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import type { SettingsOptions } from '../Settings.types';
import { MAIL_HINTS, MAIL_HOST_OPTIONS, MAIL_PORT_OPTIONS } from './MailSettings.constants';
import type { MailSettingsFormState } from './useMailSettingsForm';

interface MailServerFieldsProps {
    state: MailSettingsFormState;
    transports: SettingsOptions;
    encryptions: SettingsOptions;
    hasPassword: boolean;
    disabled: boolean;
}

function hintLabel(label: string): string {
    return `Mais informações sobre ${label.toLowerCase()}`;
}

/** Tipo de envio, servidor SMTP, porta, segurança e credenciais da conta de envio. */
export default function MailServerFields({
    state,
    transports,
    encryptions,
    hasPassword,
    disabled,
}: MailServerFieldsProps): React.JSX.Element {
    const { form, hostOption, portOption, provider, customHost, customPort } = state;
    const usesSmtp = form.data.transport === 'smtp';
    const passwordHint = [
        MAIL_HINTS.password,
        hasPassword
            ? 'Uma chave de aplicativo já está cadastrada e protegida. Deixe em branco para mantê-la.'
            : null,
        provider?.passwordHint,
    ]
        .filter(Boolean)
        .join(' ');

    const smtpChoices = usesSmtp ? (
        <>
            <SelectInputField
                id="mail-host-option"
                name="host_option"
                label="Servidor SMTP"
                required
                hint={MAIL_HINTS.hostOption}
                hintLabel={hintLabel('Servidor SMTP')}
                disabled={disabled}
                options={MAIL_HOST_OPTIONS}
                value={hostOption}
                error={customHost ? undefined : form.errors.host}
                onChange={state.chooseProvider}
            />
            <SelectInputField
                id="mail-port-option"
                name="port_option"
                label="Porta"
                required
                hint={MAIL_HINTS.portOption}
                hintLabel={hintLabel('Porta')}
                disabled={disabled}
                options={MAIL_PORT_OPTIONS}
                value={portOption}
                error={customPort ? undefined : form.errors.port}
                onChange={state.choosePort}
            />
            <SelectInputField
                id="mail-encryption"
                name="encryption"
                label="Segurança da conexão"
                required
                hint={MAIL_HINTS.encryption}
                hintLabel={hintLabel('Segurança da conexão')}
                disabled={disabled}
                options={optionsFromRecord(encryptions)}
                value={form.data.encryption}
                error={form.errors.encryption}
                onChange={(value) => form.setData('encryption', value)}
            />
        </>
    ) : null;

    const customFields =
        usesSmtp && (customHost || customPort) ? (
            <FormGrid>
                {customHost ? (
                    <TextInputField
                        id="mail-host"
                        name="host"
                        label="Endereço do servidor SMTP"
                        required
                        maxLength={255}
                        placeholder="smtp.exemplo.com"
                        autoComplete="off"
                        hint={MAIL_HINTS.host}
                        hintLabel={hintLabel('Endereço do servidor SMTP')}
                        value={form.data.host}
                        error={form.errors.host}
                        onChange={(value) => form.setData('host', value)}
                    />
                ) : null}
                {customPort ? (
                    <TextInputField
                        id="mail-port"
                        name="port"
                        type="number"
                        label="Número da porta"
                        required
                        min={1}
                        max={65535}
                        placeholder="587"
                        autoComplete="off"
                        hint={MAIL_HINTS.port}
                        hintLabel={hintLabel('Número da porta')}
                        value={form.data.port}
                        error={form.errors.port}
                        onChange={(value) => form.setData('port', value)}
                    />
                ) : null}
            </FormGrid>
        ) : null;

    const credentials = usesSmtp ? (
        <FormGrid>
            <TextInputField
                id="mail-username"
                name="username"
                label="Usuário de autenticação"
                required
                maxLength={255}
                autoComplete="off"
                hint={MAIL_HINTS.username}
                hintLabel={hintLabel('Usuário de autenticação')}
                value={form.data.username}
                error={form.errors.username}
                onChange={(value) => form.setData('username', value)}
            />
            <TextInputField
                id="mail-password"
                name="password"
                type="password"
                label="Chave de aplicativo"
                required={!hasPassword}
                maxLength={255}
                autoComplete="new-password"
                placeholder={hasPassword ? 'Chave já cadastrada' : undefined}
                hint={passwordHint}
                hintLabel={hintLabel('Chave de aplicativo')}
                value={form.data.password}
                error={form.errors.password}
                onChange={(value) => form.setData('password', value)}
            />
        </FormGrid>
    ) : null;

    return (
        <FormSection
            id="mail-server"
            title="Servidor de envio"
            variant="inline"
            iconClass="fa fa-server"
        >
            <FormStack>
                <FormGrid columns={usesSmtp ? 4 : 2}>
                    <SelectInputField
                        id="mail-transport"
                        name="transport"
                        label="Tipo de envio"
                        required
                        hint={MAIL_HINTS.transport}
                        hintLabel={hintLabel('Tipo de envio')}
                        disabled={disabled}
                        options={optionsFromRecord(transports)}
                        value={form.data.transport}
                        error={form.errors.transport}
                        onChange={(value) => form.setData('transport', value)}
                    />
                    {smtpChoices}
                </FormGrid>
                {customFields}
                {credentials}
            </FormStack>
        </FormSection>
    );
}
