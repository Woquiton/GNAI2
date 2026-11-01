import { useRef, useState } from "react";
import { useForm } from "@inertiajs/react";
import FormActions from "@/components/Forms/FormActions/FormActions";
import FormField from "@/components/Forms/FormField/FormField";
import FormGrid, { FormStack } from "@/components/Forms/FormGrid/FormGrid";
import FormLayout from "@/components/Forms/FormLayout/FormLayout";
import FormSection from "@/components/Forms/FormSection/FormSection";
import SelectField from "@/components/Forms/SelectField/SelectField";
import TextInput from "@/components/Forms/TextInput/TextInput";
import Button from "@/components/UI/Button/Button";
import CardBox from "@/components/UI/CardBox/CardBox";
import { notify } from "@/components/UI/NotificationToast/notify";
import { settingsBase, SettingsLayout } from "./SettingsPage";
import {
    MAIL_PORTS,
    MAIL_PROVIDERS,
    OTHER_OPTION,
    portChoice,
    providerChoice,
} from "./mailProviders";
import type { MailSettingsProps } from "./Settings.types";

type FormData = {
    transport: string;
    host: string;
    port: string;
    encryption: string;
    username: string;
    password: string;
    from_address: string;
    from_name: string;
};
type TextField = Exclude<keyof FormData, "transport" | "encryption">;

const requestFeedback = {
    onHttpException: () => {
        notify({
            tone: "error",
            title: "Não foi possível concluir",
            text: "Não foi possível concluir a operação. Atualize a página e tente novamente.",
        });
        return false;
    },
    onNetworkError: () => {
        notify({
            tone: "error",
            title: "Falha de conexão",
            text: "Não foi possível conectar ao servidor. Confira sua conexão e tente novamente.",
        });
        return false;
    },
};

export default function SettingsMail({
    mail,
    transports,
    encryptions,
    canUpdate,
}: MailSettingsProps): React.JSX.Element {
    const form = useForm<FormData>({
        transport: mail.transport,
        host: mail.host ?? "",
        port: mail.port === null ? "" : String(mail.port),
        encryption: mail.encryption,
        username: mail.username ?? "",
        password: "",
        from_address: mail.from_address,
        from_name: mail.from_name,
    });
    const testForm = useForm({ recipient: "" });
    const [hostOption, setHostOption] = useState(() => providerChoice(form.data.host));
    const [portOption, setPortOption] = useState(() => portChoice(form.data.port));
    const provider = MAIL_PROVIDERS.find((item) => item.key === hostOption);
    const customHost = hostOption === OTHER_OPTION;
    const customPort = portOption === OTHER_OPTION;
    const busy = useRef(false);
    const element = useRef<HTMLFormElement>(null);
    const usesSmtp = form.data.transport === "smtp";
    const testBlocked = form.isDirty || form.processing || testForm.processing;
    const describedBy = (name: keyof FormData): string | undefined =>
        [form.errors[name] ? `mail-${name}-error` : null]
            .filter(Boolean)
            .join(" ") || undefined;
    const input = (
        name: TextField,
        label: string,
        options: {
            type?: string;
            required?: boolean;
            hint?: string;
            placeholder?: string;
            autoComplete?: string;
        } = {},
    ) => (
        <FormField
            id={`mail-${name}`}
            label={label}
            hint={options.hint}
            hintLabel={options.hint ? `Mais informações sobre ${label.toLowerCase()}` : undefined}
            error={form.errors[name]}
            requiredIndicator={options.required}
        >
            <TextInput
                id={`mail-${name}`}
                name={name}
                type={options.type ?? "text"}
                required={options.required}
                maxLength={name === "port" ? undefined : 255}
                min={name === "port" ? 1 : undefined}
                max={name === "port" ? 65535 : undefined}
                placeholder={options.placeholder}
                autoComplete={options.autoComplete ?? "off"}
                value={form.data[name]}
                invalid={!!form.errors[name]}
                aria-describedby={describedBy(name)}
                onChange={(event) => form.setData(name, event.target.value)}
            />
        </FormField>
    );
    const select = (
        name: "transport" | "encryption",
        label: string,
        options: Record<string, string>,
    ) => (
        <FormField
            id={`mail-${name}`}
            label={label}
            hint={name === "transport"
                ? "SMTP envia as mensagens aos destinatários usando sua conta de e-mail. Registro em log serve para testes: registra as mensagens, mas não as envia."
                : "São formas de proteger a conexão de envio. SSL/TLS (também chamado SMTPS) protege desde o início; STARTTLS ativa essa proteção ao conectar. Use a opção indicada pelo provedor ou preenchida ao escolher o serviço."}
            hintLabel={`Mais informações sobre ${label.toLowerCase()}`}
            error={form.errors[name]}
            requiredIndicator
        >
            <SelectField
                id={`mail-${name}`}
                name={name}
                label={label}
                required
                disabled={!canUpdate || form.processing}
                value={form.data[name]}
                aria-invalid={!!form.errors[name]}
                aria-describedby={describedBy(name)}
                options={Object.entries(options).map(([value, text]) => ({
                    value,
                    label: text,
                }))}
                onChange={(event) => form.setData(name, event.target.value)}
            />
        </FormField>
    );
    // Escolher um provedor preenche servidor, porta e segurança; "Outro" libera a digitação.
    const chooseProvider = (choice: string): void => {
        const selected = MAIL_PROVIDERS.find((item) => item.key === choice);

        setHostOption(choice);
        form.clearErrors("host", "port", "encryption");

        if (!selected) {
            form.setData("host", "");
            return;
        }

        setPortOption(String(selected.port));
        form.setData((data) => ({
            ...data,
            host: selected.host,
            port: String(selected.port),
            encryption: selected.encryption,
        }));
    };
    const choosePort = (choice: string): void => {
        const selected = MAIL_PORTS.find((item) => item.value === choice);

        setPortOption(choice);
        form.clearErrors("port");
        form.setData((data) => ({
            ...data,
            port: selected?.value ?? "",
            encryption: selected?.encryption ?? data.encryption,
        }));
    };
    const choiceField = (
        id: string,
        name: "host" | "port",
        label: string,
        value: string,
        options: Array<{ value: string; label: string }>,
        showError: boolean,
        onChange: (choice: string) => void,
    ) => (
        <FormField
            id={id}
            label={label}
            hint={name === "host"
                ? "É o serviço que entrega os e-mails. Selecione o provedor da conta que será usada para enviar as mensagens. Para outro serviço, peça ao responsável pela conta o endereço de envio SMTP."
                : "É o número usado para conectar ao serviço de e-mail. A escolha do provedor preenche uma opção sugerida. Se precisar informar outro número, consulte as configurações de envio do provedor ou peça ao responsável pela conta."}
            hintLabel={`Mais informações sobre ${label.toLowerCase()}`}
            error={showError ? form.errors[name] : undefined}
            requiredIndicator
        >
            <SelectField
                id={id}
                name={`${name}_option`}
                label={label}
                required
                disabled={!canUpdate || form.processing}
                value={value}
                aria-invalid={showError && !!form.errors[name]}
                aria-describedby={showError && form.errors[name] ? `${id}-error` : undefined}
                options={options}
                onChange={(event) => onChange(event.target.value)}
            />
        </FormField>
    );
    const sendTest = (): void => {
        if (testBlocked) return;
        testForm.post(`${settingsBase}/email/teste`, {
            ...requestFeedback,
            preserveScroll: true,
            onError: () =>
                requestAnimationFrame(() =>
                    document.getElementById("mail-test-recipient")?.focus(),
                ),
        });
    };

    return (
        <FormLayout
            ref={element}
            aria-label="Configurações de e-mail"
            aria-busy={form.processing || testForm.processing}
            onSubmit={(event) => {
                event.preventDefault();
                if (!canUpdate || busy.current || form.processing) return;
                busy.current = true;
                form.put(`${settingsBase}/email`, {
                    ...requestFeedback,
                    preserveScroll: true,
                    onError: () =>
                        requestAnimationFrame(() =>
                            element.current
                                ?.querySelector<HTMLElement>(
                                    '[aria-invalid="true"]',
                                )
                                ?.focus(),
                        ),
                    onFinish: () => {
                        busy.current = false;
                    },
                });
            }}
        >
            <CardBox>
                <fieldset disabled={!canUpdate || form.processing}>
                    <FormSection
                        id="mail-server"
                        title="Servidor de envio"
                        variant="inline"
                        iconClass="fa fa-server"
                    >
                        <FormStack>
                            <FormGrid columns={usesSmtp ? 4 : 2}>
                                {select("transport", "Tipo de envio", transports)}
                                {usesSmtp ? (
                                    <>
                                        {choiceField(
                                            "mail-host-option",
                                            "host",
                                            "Servidor SMTP",
                                            hostOption,
                                            [
                                                ...MAIL_PROVIDERS.map((item) => ({
                                                    value: item.key,
                                                    label: `${item.label} (${item.host})`,
                                                })),
                                                { value: OTHER_OPTION, label: "Outro servidor" },
                                            ],
                                            !customHost,
                                            chooseProvider,
                                        )}
                                        {choiceField(
                                            "mail-port-option",
                                            "port",
                                            "Porta",
                                            portOption,
                                            [
                                                ...MAIL_PORTS.map(({ value, label }) => ({ value, label })),
                                                { value: OTHER_OPTION, label: "Outra porta" },
                                            ],
                                            !customPort,
                                            choosePort,
                                        )}
                                        {select(
                                            "encryption",
                                            "Segurança da conexão",
                                            encryptions,
                                        )}
                                    </>
                                ) : null}
                            </FormGrid>
                            {usesSmtp && (customHost || customPort) ? (
                                <FormGrid>
                                    {customHost
                                        ? input("host", "Endereço do servidor SMTP", {
                                            required: true,
                                            placeholder: "smtp.exemplo.com",
                                            hint: "Copie o endereço SMTP informado pelo serviço de e-mail. Se não souber qual é, peça ao responsável pela conta.",
                                        })
                                        : null}
                                    {customPort
                                        ? input("port", "Número da porta", {
                                            type: "number",
                                            required: true,
                                            placeholder: "587",
                                            hint: "Informe a porta indicada nas configurações de envio do seu serviço de e-mail. Peça esse número ao responsável pela conta se necessário.",
                                        })
                                        : null}
                                </FormGrid>
                            ) : null}
                            {usesSmtp ? (
                                <FormGrid>
                                    {input("username", "Usuário de autenticação", {
                                        hint: "Informe o login da conta que enviará os e-mails. Na maioria dos serviços, é o endereço completo dessa conta, por exemplo: atendimento@escola.com.br.",
                                    })}
                                    {input("password", "Senha ou chave de aplicativo", {
                                        type: "password",
                                        autoComplete: "new-password",
                                        placeholder: mail.has_password
                                            ? "••••••••"
                                            : undefined,
                                        hint: [
                                            "Informe a senha de envio da conta. Se o serviço pedir uma senha de aplicativo, crie essa senha nas configurações de segurança do e-mail.",
                                            mail.has_password
                                                ? "Deixe em branco para manter a senha atual."
                                                : null,
                                            provider?.passwordHint,
                                        ]
                                            .filter(Boolean)
                                            .join(" "),
                                    })}
                                </FormGrid>
                            ) : null}
                        </FormStack>
                    </FormSection>
                    <FormSection
                        id="mail-sender"
                        title="Remetente"
                        variant="inline"
                        iconClass="fa fa-envelope"
                    >
                        <FormGrid>
                            {input("from_address", "E-mail de envio", {
                                type: "email",
                                required: true,
                                hint: "Informe o endereço que as pessoas verão como remetente das mensagens. Use a conta configurada acima ou um endereço que o serviço permita usar para envio.",
                            })}
                            {input("from_name", "Nome do remetente", {
                                required: true,
                                hint: "Informe o nome que aparecerá para quem receber os e-mails, por exemplo: Equipe Gnai ou o nome da instituição.",
                            })}
                        </FormGrid>
                    </FormSection>
                    {canUpdate ? (
                        <FormSection
                            id="mail-test"
                            title="Enviar e-mail de teste"
                            variant="inline"
                            iconClass="fa fa-paper-plane"
                        >
                            <div className="settingsPage__test">
                                <FormField
                                    id="mail-test-recipient"
                                    label="E-mail de destino"
                                    hint="Informe o e-mail que receberá a mensagem de teste. Se alterou algum campo, salve antes de testar."
                                    hintLabel="Mais informações sobre o e-mail de teste"
                                    error={testForm.errors.recipient}
                                >
                                    <TextInput
                                        id="mail-test-recipient"
                                        name="recipient"
                                        type="email"
                                        maxLength={255}
                                        autoComplete="email"
                                        value={testForm.data.recipient}
                                        disabled={testForm.processing}
                                        invalid={!!testForm.errors.recipient}
                                        aria-describedby={[
                                            testForm.errors.recipient
                                                ? "mail-test-recipient-error"
                                                : null,
                                        ]
                                            .filter(Boolean)
                                            .join(" ")}
                                        onKeyDown={(event) => {
                                            if (event.key !== "Enter") return;
                                            event.preventDefault();
                                            sendTest();
                                        }}
                                        onChange={(event) =>
                                            testForm.setData(
                                                "recipient",
                                                event.target.value,
                                            )
                                        }
                                    />
                                </FormField>
                                <Button
                                    type="button"
                                    tone="dark-blue"
                                    leftIconClass="fa fa-paper-plane"
                                    label={
                                        testForm.processing
                                            ? "Enviando..."
                                            : "Enviar teste"
                                    }
                                    title="Enviar e-mail de teste"
                                    aria-label={
                                        testForm.processing
                                            ? "Enviando e-mail de teste"
                                            : "Enviar e-mail de teste"
                                    }
                                    disabled={testBlocked}
                                    onClick={sendTest}
                                />
                            </div>
                        </FormSection>
                    ) : null}
                </fieldset>
            </CardBox>
            <FormActions
                status={
                    form.processing
                        ? "Salvando configurações de e-mail..."
                        : testForm.processing
                          ? "Enviando e-mail de teste..."
                          : ""
                }
            >
                <Button
                    href="/autenticacao/painel"
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
                                ? "Salvando configurações de e-mail"
                                : "Salvar configurações de e-mail"
                        }
                        disabled={form.processing || testForm.processing}
                    />
                ) : null}
            </FormActions>
        </FormLayout>
    );
}

SettingsMail.layout = SettingsLayout;
