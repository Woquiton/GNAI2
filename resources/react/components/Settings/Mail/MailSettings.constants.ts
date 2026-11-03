export const OTHER_OPTION = 'other';

export interface MailProvider {
    key: string;
    label: string;
    host: string;
    port: number;
    encryption: 'tls' | 'ssl';
    passwordHint?: string;
}

// Atalhos de preenchimento: o backend continua recebendo apenas host, porta e segurança.
export const MAIL_PROVIDERS: MailProvider[] = [
    {
        key: 'gmail',
        label: 'Gmail / Google Workspace',
        host: 'smtp.gmail.com',
        port: 587,
        encryption: 'tls',
        passwordHint: 'No Gmail, use uma chave de app (exige a verificação em duas etapas ativa).',
    },
    {
        key: 'outlook',
        label: 'Outlook.com / Hotmail',
        host: 'smtp-mail.outlook.com',
        port: 587,
        encryption: 'tls',
        passwordHint:
            'Se o teste falhar, peça ao responsável pela conta que confira se ela permite o envio de e-mails pelo Gnai.',
    },
    {
        key: 'office365',
        label: 'Microsoft 365',
        host: 'smtp.office365.com',
        port: 587,
        encryption: 'tls',
        passwordHint:
            'No Microsoft 365, peça ao administrador da conta que autorize o envio de e-mails por aplicativos, como o Gnai.',
    },
    {
        key: 'yahoo',
        label: 'Yahoo Mail',
        host: 'smtp.mail.yahoo.com',
        port: 465,
        encryption: 'ssl',
        passwordHint: 'No Yahoo, gere uma chave de app nas configurações de segurança da conta.',
    },
    {
        key: 'zoho',
        label: 'Zoho Mail',
        host: 'smtp.zoho.com',
        port: 465,
        encryption: 'ssl',
    },
    {
        key: 'hostinger',
        label: 'Hostinger',
        host: 'smtp.hostinger.com',
        port: 465,
        encryption: 'ssl',
    },
    {
        key: 'locaweb',
        label: 'Locaweb',
        host: 'email-ssl.com.br',
        port: 465,
        encryption: 'ssl',
    },
];

export const MAIL_PORTS: Array<{
    value: string;
    label: string;
    encryption?: 'tls' | 'ssl';
}> = [
    { value: '587', label: '587 (STARTTLS)', encryption: 'tls' },
    { value: '465', label: '465 (SSL/TLS)', encryption: 'ssl' },
    { value: '25', label: '25' },
    { value: '2525', label: '2525' },
];

export function providerChoice(host: string): string {
    if (!host) return '';

    return (
        MAIL_PROVIDERS.find((provider) => provider.host === host.trim().toLowerCase())?.key ??
        OTHER_OPTION
    );
}

export function portChoice(port: string): string {
    if (!port) return '';

    return MAIL_PORTS.some((option) => option.value === port) ? port : OTHER_OPTION;
}

/** Opções do select "Servidor SMTP": provedores conhecidos e a digitação livre. */
export const MAIL_HOST_OPTIONS = [
    ...MAIL_PROVIDERS.map((item) => ({ value: item.key, label: `${item.label} (${item.host})` })),
    { value: OTHER_OPTION, label: 'Outro servidor' },
];

/** Opções do select "Porta": portas comuns e a digitação livre. */
export const MAIL_PORT_OPTIONS = [
    ...MAIL_PORTS.map(({ value, label }) => ({ value, label })),
    { value: OTHER_OPTION, label: 'Outra porta' },
];

/** Dicas exibidas no tooltip de cada campo do servidor de envio. */
export const MAIL_HINTS = {
    transport:
        'SMTP envia as mensagens aos destinatários usando sua conta de e-mail. Registro em log serve para testes: registra as mensagens, mas não as envia.',
    encryption:
        'São formas de proteger a conexão de envio. SSL/TLS (também chamado SMTPS) protege desde o início; STARTTLS ativa essa proteção ao conectar. Use a opção indicada pelo provedor ou preenchida ao escolher o serviço.',
    hostOption:
        'É o serviço que entrega os e-mails. Selecione o provedor da conta que será usada para enviar as mensagens. Para outro serviço, peça ao responsável pela conta o endereço de envio SMTP.',
    portOption:
        'É o número usado para conectar ao serviço de e-mail. A escolha do provedor preenche uma opção sugerida. Se precisar informar outro número, consulte as configurações de envio do provedor ou peça ao responsável pela conta.',
    host: 'Copie o endereço SMTP informado pelo serviço de e-mail. Se não souber qual é, peça ao responsável pela conta.',
    port: 'Informe a porta indicada nas configurações de envio do seu serviço de e-mail. Peça esse número ao responsável pela conta se necessário.',
    username:
        'É a conta que o Gnai usa para entrar no servidor SMTP. Normalmente, é o endereço completo da caixa de e-mail, por exemplo: atendimento@escola.com.br.',
    password:
        'Informe a chave de aplicativo criada nas configurações de segurança da conta de e-mail. A chave é armazenada de forma criptografada e nunca volta a ser exibida.',
    fromAddress:
        'É o endereço que as pessoas verão como remetente. Ele pode ser diferente do usuário de autenticação somente quando o serviço autorizar esse endereço ou alias; caso contrário, use o mesmo e-mail nos dois campos.',
    fromName:
        'Informe o nome que aparecerá para quem receber os e-mails, por exemplo: Equipe Gnai ou o nome da instituição.',
    recipient:
        'Informe o e-mail que receberá a mensagem de teste. Se alterou algum campo, salve antes de testar.',
};
