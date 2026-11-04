import { helpUrls } from '@/components/Help/Help.routes';
import type {
    GuidedTourPageConfig,
    GuidedTourStep,
} from '@/components/UI/GuidedTour/GuidedTour.types';
import type { settingsCategories } from './Settings.constants';

/** Valores de `data-tour` das partes das telas de configuração. */
export const SETTINGS_TOUR_TARGETS = {
    mailFolders: 'settings-mail-folders',
    tabs: 'settings-tabs',
    sessionTimeouts: 'settings-session-timeouts',
    sessionActions: 'settings-session-actions',
    mailStatus: 'settings-mail-status',
    mailServer: 'settings-mail-server',
    mailSender: 'settings-mail-sender',
    mailBounces: 'settings-mail-bounces',
    mailInbox: 'settings-mail-inbox',
    mailTest: 'settings-mail-test',
    mailActions: 'settings-mail-actions',
    backupRetention: 'settings-backup-retention',
    backupSchedule: 'settings-backup-schedule',
    backupActions: 'settings-backup-actions',
    teacherDomains: 'settings-teacher-domains',
    teacherActions: 'settings-teacher-actions',
    pdfIdentification: 'settings-pdf-identification',
    pdfPreview: 'settings-pdf-preview',
    pdfActions: 'settings-pdf-actions',
} as const;

const targets = SETTINGS_TOUR_TARGETS;
const HELP_SLUG = 'configuracoes';

const tabsStep: GuidedTourStep = {
    id: 'settings-tabs',
    target: targets.tabs,
    title: 'Categorias de configuração',
    content: [
        'As configurações ficam separadas em abas: E-mail, Backups, Acesso dos professores, PDFs e Segurança e sessões.',
        'Clique no nome de uma aba para abrir a categoria. Cada aba tem o seu próprio botão Salvar.',
    ],
};

function actionsStep(id: string, target: string, saved: string): GuidedTourStep {
    return {
        id,
        target,
        title: 'Salvar ou cancelar',
        content: [
            `Clique em Salvar para gravar ${saved}. Se faltar alguma informação, o aviso aparece embaixo do campo.`,
            'Cancelar volta para o início sem salvar. Se você só pode consultar as configurações, o botão Salvar não aparece.',
        ],
    };
}

export const settingsMailTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'configurar-o-envio-de-e-mails'),
    steps: [
        tabsStep,
        {
            id: 'settings-mail-status',
            target: targets.mailStatus,
            title: 'Situação do envio',
            content: [
                'Este quadro mostra a conta usada para enviar os e-mails, o remetente e se a chave de aplicativo está cadastrada. A chave nunca aparece na tela.',
                'O título do quadro mostra a situação do envio: o resultado do último teste, com a data e a hora, ou um aviso quando a configuração está incompleta ou o envio está desativado.',
            ],
        },
        {
            id: 'settings-mail-server',
            target: targets.mailServer,
            title: 'Servidor de envio',
            content: [
                'Escolha o Tipo de envio. Com SMTP, escolha o provedor em Servidor SMTP e o Gnai preenche a porta e a segurança para você. Para outro serviço, escolha Outro servidor e informe o endereço.',
                'Depois, informe o Usuário de autenticação e a Chave de aplicativo. Depois de salva, deixe a chave em branco para manter a atual. Os campos com asterisco (*) são obrigatórios.',
            ],
        },
        {
            id: 'settings-mail-sender',
            target: targets.mailSender,
            title: 'Remetente',
            content: [
                'Informe o E-mail de envio e o Nome do remetente. É assim que as pessoas veem quem mandou a mensagem.',
                'Muitos provedores só aceitam o endereço da própria conta como e-mail de envio.',
            ],
        },
        {
            id: 'settings-mail-bounces',
            target: targets.mailBounces,
            title: 'Rejeições do Gmail',
            content: [
                'Com uma conta Gmail / Google Workspace, marque Monitorar rejeições do Gmail e informe a pasta que recebe os avisos. A leitura usa a mesma conta e chave de aplicativo do envio.',
                'Depois de salvar, o sistema consulta as rejeições a cada cinco minutos. A conta precisa permitir leitura por IMAP. Salvar não confirma a conexão; o teste de envio verifica apenas o envio.',
            ],
        },
        {
            id: 'settings-mail-inbox',
            target: targets.mailInbox,
            title: 'Respostas do Gmail',
            content:
                'Marque Importar respostas do Gmail para receber as respostas aos e-mails do sistema. Informe INBOX ou a pasta que recebe essas respostas. Salve e use Buscar respostas na Inbox. A leitura usa a mesma conta do envio e não altera a caixa do Gmail.',
        },
        {
            id: 'mail-folders',
            target: SETTINGS_TOUR_TARGETS.mailFolders,
            title: 'Pastas do Gmail',
            content:
                'Ative Sincronizar pastas com o Gmail para aplicar Spam, Lixeira, Arquivar e Restaurar também na conta da instituição. As pastas dessas mensagens são compartilhadas. Estrelas, leitura e marcadores continuam pessoais. As mudanças feitas no Gmail são consultadas a cada minuto, em lotes.',
        },
        {
            id: 'settings-mail-test',
            target: targets.mailTest,
            title: 'Enviar e-mail de teste',
            content: [
                'Aqui você confere se a configuração funciona. Informe o E-mail de destino e clique em Enviar teste.',
                'O teste usa a configuração salva. Por isso, salve as mudanças antes de testar. Depois, confira a caixa de entrada e a pasta de spam.',
            ],
        },
        actionsStep('settings-mail-actions', targets.mailActions, 'a configuração de e-mail'),
    ],
};

export const settingsBackupTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'definir-os-horarios-e-a-retencao-dos-backups-automaticos'),
    steps: [
        tabsStep,
        {
            id: 'settings-backup-retention',
            target: targets.backupRetention,
            title: 'Retenção',
            content: [
                'Escolha como manter os backups: uma quantidade de cópias mais recentes ou um número de dias. Depois, informe o valor, de 1 a 365.',
                'As cópias que passam desse limite são apagadas sozinhas. A cópia mais recente sempre fica guardada.',
            ],
        },
        {
            id: 'settings-backup-schedule',
            target: targets.backupSchedule,
            title: 'Backup automático',
            content: [
                'Informe de 1 a 6 horários por dia para o Gnai fazer as cópias. Os horários não podem se repetir.',
                'Clique em Adicionar horário para incluir outro. Use o botão ao lado do campo para remover um horário.',
            ],
        },
        actionsStep('settings-backup-actions', targets.backupActions, 'os horários e a retenção'),
    ],
};

export const settingsTeacherAccessTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'configurar-os-dominios-de-e-mail-dos-professores'),
    steps: [
        tabsStep,
        {
            id: 'settings-teacher-domains',
            target: targets.teacherDomains,
            title: 'Domínios de e-mail aceitos',
            content: [
                'Informe só o domínio do e-mail, como escola.edu.br, um em cada linha. Só professores com e-mail desses domínios recebem o link de acesso.',
                'Clique no botão Domínio, com o sinal de mais, para adicionar uma linha. Use o botão ao lado do campo para remover. Com a lista vazia, qualquer professor cadastrado pode pedir o link.',
            ],
        },
        actionsStep('settings-teacher-actions', targets.teacherActions, 'a lista de domínios'),
    ],
};

export const settingsPdfTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'personalizar-o-cabecalho-dos-pdfs'),
    steps: [
        tabsStep,
        {
            id: 'settings-pdf-identification',
            target: targets.pdfIdentification,
            title: 'Identificação',
            content: [
                'Escolha o Logotipo da instituição, em JPG ou PNG, e o Formato do logotipo. Remover deixa o cabeçalho sem imagem depois de salvar.',
                'Preencha o Nome da instituição, que tem asterisco (*) e é obrigatório. O Núcleo ou setor emissor e o Texto complementar são opcionais. Pressione Enter para quebrar a linha no PDF.',
            ],
        },
        {
            id: 'settings-pdf-preview',
            target: targets.pdfPreview,
            title: 'Prévia do cabeçalho',
            content: [
                'Mostra como o cabeçalho vai sair nos PDFs. Ela muda enquanto você preenche os campos.',
                'O título do documento muda conforme o PDF gerado.',
            ],
        },
        actionsStep('settings-pdf-actions', targets.pdfActions, 'o cabeçalho dos próximos PDFs'),
    ],
};

export const settingsSessionSecurityTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'configurar-o-bloqueio-e-o-encerramento-das-sessoes'),
    steps: [
        tabsStep,
        {
            id: 'settings-session-timeouts',
            target: targets.sessionTimeouts,
            title: 'Prazos de inatividade',
            content: [
                'Informe em minutos quando bloquear a tela e quando encerrar a sessão. O encerramento deve acontecer depois do bloqueio, contado desde a última atividade, incluindo o tempo na tela bloqueada. Use os ícones de informação para consultar as orientações.',
                'Professores sem senha própria não passam pelo bloqueio com senha, mas também são desconectados. Consultas automáticas não prolongam o acesso. Os valores salvos valem na próxima verificação; diminuir os prazos pode bloquear ou encerrar sessões que já estavam inativas.',
            ],
        },
        actionsStep('settings-session-actions', targets.sessionActions, 'os prazos de inatividade'),
    ],
};

type SettingsCategoryKey = (typeof settingsCategories)[number]['key'];

/** Tutorial de cada aba de configuração, escolhido pelo layout compartilhado. */
export const settingsTours: Record<SettingsCategoryKey, GuidedTourPageConfig> = {
    mail: settingsMailTour,
    backup: settingsBackupTour,
    'teacher-access': settingsTeacherAccessTour,
    pdf: settingsPdfTour,
    'session-security': settingsSessionSecurityTour,
};
