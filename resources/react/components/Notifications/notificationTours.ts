import { helpUrls } from '@/components/Help/Help.routes';
import type { TableListTourConfig } from '@/components/Tables/TableList/TableList';

const HELP_SLUG = 'notificacoes';

/**
 * Tutorial do histórico de notificações. A tela não tem filtros nem demonstrações: os passos
 * padrão de filtros saem sozinhos, e o tutorial não marca nenhuma notificação como lida.
 */
export const notificationListTour: TableListTourConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'consultar-o-historico-de-notificacoes'),
    actions: [
        'Clique em Marcar todas como lidas para dar como lidas todas as suas notificações de uma vez.',
        'Elas continuam aqui no histórico. Só deixam de aparecer no sino da barra do topo e na contagem.',
    ],
    table: [
        'Cada linha é uma notificação sua, das mais recentes para as mais antigas. Aparecem o título, a mensagem, quando chegou e o status, Lida ou Não lida.',
        'No fim da linha, o botão de seta abre a tela ligada à notificação. O botão de check marca a notificação como lida e aparece só nas que você ainda não leu.',
    ],
};
