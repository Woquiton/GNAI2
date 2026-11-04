import { helpUrls } from '@/components/Help/Help.routes';
import { tableListTourSteps } from '@/components/Tables/TableList/tableListTour';
import type { GuidedTourPageConfig } from '@/components/UI/GuidedTour/GuidedTour.types';

export const EMAIL_TOUR_TARGETS = {
    folders: 'email-folders',
    tracking: 'email-tracking',
    content: 'email-content',
} as const;

export const emailInboxTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show('central-de-emails'),
    actions: 'Clique em Atualizar para consultar novamente os resultados dos envios.',
    steps: [
        {
            id: 'folders',
            target: EMAIL_TOUR_TARGETS.folders,
            title: 'Envios por status',
            content: [
                'Escolha um status para consultar os e-mails enviados, pendentes ou com falha.',
                'As contagens consideram o assunto, a origem e o período que você selecionou.',
            ],
        },
        ...tableListTourSteps({
            filters: 'Pesquise pelo assunto e selecione a origem. Em Mais filtros, escolha o status e o período de registro.',
            table: 'Cada linha mostra um envio, com destinatário, assunto, status e data de registro. Abra o assunto ou clique em Visualizar para consultar os detalhes. Envios pendentes nas linhas exibidas são atualizados automaticamente.',
        }),
    ],
};

export const emailDetailsTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show('central-de-emails', 'consultar-um-envio'),
    steps: [
        {
            id: 'tracking',
            target: EMAIL_TOUR_TARGETS.tracking,
            title: 'Resultado do envio',
            content: 'Consulte o destinatário, a origem, as tentativas e as datas do envio. O aceite pelo serviço não confirma a leitura da mensagem.',
        },
        {
            id: 'content',
            target: EMAIL_TOUR_TARGETS.content,
            title: 'Conteúdo da mensagem',
            content: 'Confira o texto registrado para este aviso. Os links de acesso e redefinição de senha não são exibidos nesta consulta.',
        },
    ],
};
