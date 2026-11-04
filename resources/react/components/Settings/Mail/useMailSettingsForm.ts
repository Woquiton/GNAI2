import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import { settingsUrls } from '../Settings.routes';
import type { MailSettingsProps } from '../Settings.types';
import { MAIL_PORTS, MAIL_PROVIDERS, OTHER_OPTION, portChoice, providerChoice } from './MailSettings.constants';

export interface MailSettingsFormData {
    transport: string;
    host: string;
    port: string;
    encryption: string;
    username: string;
    password: string;
    from_address: string;
    from_name: string;
    gmail_bounces_enabled: boolean;
    gmail_bounces_folder: string;
}

const FAILURE_TEXT = 'Não foi possível concluir a operação. Atualize a página e tente novamente.';

function initialData(mail: MailSettingsProps['mail']): MailSettingsFormData {
    return {
        transport: mail.transport,
        host: mail.host ?? '',
        port: mail.port === null ? '' : String(mail.port),
        encryption: mail.encryption,
        username: mail.username ?? '',
        password: '',
        from_address: mail.from_address,
        from_name: mail.from_name,
        gmail_bounces_enabled: mail.gmail_bounces_enabled,
        gmail_bounces_folder: mail.gmail_bounces_folder,
    };
}

/**
 * Estado das configurações de e-mail: atalhos de provedor e porta (que preenchem servidor, porta e
 * segurança), salvamento e envio do e-mail de teste.
 */
export function useMailSettingsForm({
    mail,
    canUpdate,
}: Pick<MailSettingsProps, 'mail' | 'canUpdate'>) {
    const form = useForm<MailSettingsFormData>(initialData(mail));
    const testForm = useForm({ recipient: '' });
    const { formRef, submit } = useFormSubmission(form);
    const testSubmission = useFormSubmission(testForm);
    const [hostOption, setHostOption] = useState(() => providerChoice(form.data.host));
    const [portOption, setPortOption] = useState(() => portChoice(form.data.port));
    const testBlocked = form.isDirty || form.processing || testForm.processing;

    // Escolher um provedor preenche servidor, porta e segurança; "Outro" libera a digitação.
    function chooseProvider(choice: string): void {
        const selected = MAIL_PROVIDERS.find((item) => item.key === choice);

        setHostOption(choice);
        form.clearErrors('host', 'port', 'encryption');

        if (!selected) {
            form.setData('host', '');
            return;
        }

        setPortOption(String(selected.port));
        form.setData((data) => ({
            ...data,
            host: selected.host,
            port: String(selected.port),
            encryption: selected.encryption,
        }));
    }

    function choosePort(choice: string): void {
        const selected = MAIL_PORTS.find((item) => item.value === choice);

        setPortOption(choice);
        form.clearErrors('port');
        form.setData((data) => ({
            ...data,
            port: selected?.value ?? '',
            encryption: selected?.encryption ?? data.encryption,
        }));
    }

    function save(): void {
        submit({
            url: settingsUrls.mail,
            method: 'put',
            failureText: FAILURE_TEXT,
            blocked: !canUpdate,
            options: {
                onSuccess: () => {
                    const savedData = { ...form.data, password: '' };

                    form.setDefaults(savedData);
                    form.setData(savedData);
                },
            },
        });
    }

    function sendTest(): void {
        testSubmission.submit({
            url: settingsUrls.mailTest,
            failureText: FAILURE_TEXT,
            blocked: testBlocked,
            options: {
                onError: () =>
                    requestAnimationFrame(() =>
                        document.getElementById('mail-test-recipient')?.focus(),
                    ),
            },
        });
    }

    return {
        form,
        testForm,
        formRef,
        hostOption,
        portOption,
        provider: MAIL_PROVIDERS.find((item) => item.key === hostOption),
        customHost: hostOption === OTHER_OPTION,
        customPort: portOption === OTHER_OPTION,
        testBlocked,
        chooseProvider,
        choosePort,
        save,
        sendTest,
    };
}

export type MailSettingsFormState = ReturnType<typeof useMailSettingsForm>;
