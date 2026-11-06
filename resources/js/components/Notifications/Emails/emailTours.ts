import { helpUrls } from '@/components/Help/Help.routes';
import { tableListTourSteps } from '@/components/Tables/TableList/tableListTour';
import type { GuidedTourPageConfig } from '@/components/UI/GuidedTour/GuidedTour.types';

export const EMAIL_TOUR_TARGETS = {
    folders: 'email-folders',
    tracking: 'email-tracking',
    content: 'email-content',
    toolbar: 'email-toolbar',
    compose: 'email-compose',
    attachments: 'email-attachments',
    composeActions: 'email-compose-actions',
    reply: 'email-reply',
    sync: 'email-sync',
    folderSync: 'email-folder-sync',
    thread: 'email-thread',
} as const;

export const emailInboxTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show('central-de-emails'),
    actions: 'Clique em Atualizar para consultar novamente os resultados dos envios.',
    steps: [
        {
            id: 'sync',
            target: EMAIL_TOUR_TARGETS.sync,
            title: 'Buscar respostas',
            content:
                'Consulte agora as respostas recebidas no Gmail aos e-mails do Gnai. A consulta automática ocorre a cada minuto. As respostas importadas aparecem na Caixa de entrada, com remetente, mensagem original e anexos disponíveis.',
        },
        {
            id: 'folders',
            target: EMAIL_TOUR_TARGETS.folders,
            title: 'Pastas e marcadores',
            content: [
                'Use Escrever para criar uma mensagem. Consulte enviados, rascunhos, favoritos, arquivo, spam e lixeira. Os marcadores vêm das etiquetas cadastradas para o módulo Inbox, com o nome e a cor definidos nesse cadastro.',
                'Com a sincronização de pastas ativa, Spam, Lixeira, Arquivar e Restaurar afetam o Gmail e os usuários da instalação. Estrelas, leitura e marcadores continuam pessoais. Rascunhos são privados ao autor e ficam somente no Gnai.',
            ],
        },
        {
            id: 'folder-sync',
            target: EMAIL_TOUR_TARGETS.folderSync,
            title: 'Sincronizar pastas',
            content:
                'Confira as pastas atuais no Gmail das mensagens registradas no Gnai. A consulta também ocorre automaticamente a cada minuto, em lotes. As ações de pasta na conta compartilhada exigem permissão de envio de e-mails.',
        },
        {
            id: 'organize',
            target: EMAIL_TOUR_TARGETS.toolbar,
            title: 'Organizar mensagens',
            content:
                'Selecione mensagens nas caixas da listagem. Use os botões para arquivar, mover para spam ou lixeira, aplicar uma etiqueta ativa da Inbox como marcador e alterar leitura ou favoritos. Etiquetas inativas já aplicadas continuam visíveis, mas não podem ser aplicadas novamente. A lixeira permite restauração.',
        },
        ...tableListTourSteps({
            filters:
                'Pesquise pelo assunto e selecione a origem. Em Mais filtros, escolha o status e o período de registro.',
            table: 'Cada linha reúne seleção, estrela, situação, correspondente, assunto, prévia, anexos e data. De identifica uma resposta recebida; Para identifica um envio. Clique no assunto para ler. Rascunhos abrem o editor para quem tem permissão de envio.',
        }),
    ],
};

export const emailComposeTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show('central-de-emails', 'escrever-e-enviar'),
    steps: [
        {
            id: 'compose',
            target: EMAIL_TOUR_TARGETS.compose,
            title: 'Escrever e-mail',
            content:
                'Em Para, Cc e Cco, use + E-mail para adicionar destinatários em linhas separadas. Remova uma linha pelo X ao lado do campo. Você também pode colar vários endereços separados por vírgula, ponto e vírgula ou quebra de linha. Preencha o assunto e a mensagem. O remetente é a conta configurada nesta instalação.',
        },
        {
            id: 'attachments',
            target: EMAIL_TOUR_TARGETS.attachments,
            title: 'Anexos',
            content:
                'Anexe até cinco arquivos de até 5 MB cada. Os anexos existentes de um rascunho podem ser removidos antes de salvar.',
        },
        {
            id: 'actions',
            target: EMAIL_TOUR_TARGETS.composeActions,
            title: 'Enviar ou salvar rascunho',
            content:
                'Salvar rascunho guarda a mensagem sem enviar. Enviar inicia o processamento pela conta da instituição. Consulte o resultado depois do envio. Cancelar permite sair sem salvar as últimas alterações.',
        },
    ],
};

export const emailDetailsTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show('central-de-emails', 'consultar-um-envio'),
    steps: [
        {
            id: 'thread',
            target: EMAIL_TOUR_TARGETS.thread,
            title: 'Conversa por e-mail',
            content: [
                'As mensagens e respostas vinculadas aparecem em um painel contínuo, da mais antiga para a mais recente, com divisórias entre elas. Ao abrir, a página leva você até a Mensagem selecionada, correspondente à linha clicada na Inbox. Cada mensagem continua em uma linha separada na listagem.',
                'Confira o remetente, o texto e os anexos de cada mensagem. Use Responder a esta mensagem para responder a uma mensagem anterior, ou Encaminhar para enviar somente aquela mensagem.',
            ],
        },
        {
            id: 'reply',
            target: EMAIL_TOUR_TARGETS.reply,
            title: 'Responder',
            content:
                'O quadro abaixo indica a mensagem que receberá a resposta. Ao abrir a conversa, ele responde à mensagem mais recente. Confira o campo Para: uma resposta recebida responde ao remetente, e um envio responde aos destinatários daquele envio. Use Editor completo para alterar endereços ou adicionar anexos. Você também pode salvar um rascunho.',
        },
        {
            id: 'tracking',
            target: EMAIL_TOUR_TARGETS.tracking,
            title: 'Resultado do envio',
            content:
                'Clique no cabeçalho do painel para abrir ou recolher os detalhes da mensagem. Consulte destinatário, origem, tentativas e datas do envio. Nas respostas recebidas, o painel mostra os dados do recebimento. Quando uma rejeição do Gmail é processada, o código aparece nos detalhes do envio.',
        },
        {
            id: 'content',
            target: EMAIL_TOUR_TARGETS.content,
            title: 'Conteúdo da mensagem',
            content:
                'Confira o texto registrado para este aviso. Os links de acesso e redefinição de senha não são exibidos nesta consulta.',
        },
    ],
};
