import { helpUrls } from '@/components/Help/Help.routes';
import type { GuidedTourPageConfig } from '@/components/UI/GuidedTour/GuidedTour.types';

/** Valores de `data-tour` dos blocos do painel destacados pelo tutorial. */
export const OVERVIEW_TOUR_TARGETS = {
    stats: 'overview-stats',
    feed: 'overview-feed',
    feedFilters: 'overview-feed-filters',
    feedMore: 'overview-feed-more',
    peis: 'overview-peis',
    pendencies: 'overview-pendencies',
    sessionsByStatus: 'overview-sessions-status',
    sessionsByMonth: 'overview-sessions-month',
    radarStats: 'overview-radar-stats',
    barrierStatus: 'overview-barrier-status',
    barrierMap: 'overview-barrier-map',
} as const;

const targets = OVERVIEW_TOUR_TARGETS;

const SUPPORT_GROUP = 'Gráficos do atendimento';
const RADAR_GROUP = 'Recursos e barreiras';

/**
 * Tutorial ao vivo do painel. A trilha de navegação e o nome da tela vêm do `BusinessPage`;
 * "Carregar mais" só entra quando o botão está na tela.
 */
export const overviewTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show('painel'),
    steps: [
        {
            id: 'stats',
            target: targets.stats,
            group: 'Números do atendimento',
            title: 'Números principais',
            content: [
                'Estes cartões mostram os totais do atendimento: alunos, equipe, PEIs finalizados, agendamentos e pendências.',
                'Clique em um cartão para abrir a lista com esses registros.',
            ],
        },
        {
            id: 'feed',
            target: targets.feed,
            group: 'Atividades recentes',
            title: 'Atividades recentes',
            content: [
                'Aqui aparecem as últimas mudanças nos documentos dos alunos, como estudos de caso, PAEEs e adaptações do PEI.',
                'Cada linha diz quem fez a mudança e quando. Clique na frase para abrir o documento.',
            ],
        },
        {
            id: 'feed-filters',
            target: targets.feedFilters,
            group: 'Atividades recentes',
            title: 'Filtros das atividades',
            content: [
                'Escolha um tipo de documento ou um período para ver só o que interessa.',
                'A lista muda na hora, sem recarregar a tela.',
            ],
        },
        {
            id: 'feed-more',
            target: targets.feedMore,
            group: 'Atividades recentes',
            title: 'Carregar mais',
            content: 'A lista mostra 10 atividades por vez. Clique aqui para ver as mais antigas.',
        },
        {
            id: 'support-charts',
            target: [
                targets.peis,
                targets.pendencies,
                targets.sessionsByStatus,
                targets.sessionsByMonth,
            ],
            group: SUPPORT_GROUP,
            title: 'Gráficos do atendimento',
            content: [
                'Estes gráficos resumem o atendimento: PEIs, pendências e agendamentos.',
                'Clique em Próximo para conhecer cada um.',
            ],
        },
        {
            id: 'peis',
            target: targets.peis,
            group: SUPPORT_GROUP,
            title: 'Status dos PEIs',
            content: [
                'Mostra quantos PEIs já foram finalizados, em porcentagem.',
                'Embaixo, você vê quantos estão finalizados, quantos ainda não estão e o total.',
            ],
        },
        {
            id: 'pendencies',
            target: targets.pendencies,
            group: SUPPORT_GROUP,
            title: 'Pendências por prioridade',
            content:
                'Mostra as pendências que ainda não foram concluídas, separadas por prioridade.',
        },
        {
            id: 'sessions-status',
            target: targets.sessionsByStatus,
            group: SUPPORT_GROUP,
            title: 'Agendamentos por status',
            content: [
                'Mostra todos os agendamentos, separados pela situação de cada um.',
                'Passe o mouse sobre o gráfico para ver os números.',
            ],
        },
        {
            id: 'sessions-month',
            target: targets.sessionsByMonth,
            group: SUPPORT_GROUP,
            title: 'Agendamentos nos últimos 6 meses',
            content: [
                'Mostra, mês a mês, quantos agendamentos foram realizados, cancelados ou ainda estão marcados.',
                'Passe o mouse sobre um mês para ver os números.',
            ],
        },
        {
            id: 'radar-stats',
            target: targets.radarStats,
            group: RADAR_GROUP,
            title: 'Recursos de acessibilidade',
            content: [
                'Estes números mostram as tecnologias assistivas, os materiais pedagógicos acessíveis, os empréstimos e a fila de espera.',
                'Clique em um número para abrir a lista.',
            ],
        },
        {
            id: 'barrier-status',
            target: targets.barrierStatus,
            group: RADAR_GROUP,
            title: 'Status das barreiras',
            content:
                'Mostra quantas barreiras estão em cada situação, como identificada, em tratamento ou resolvida.',
        },
        {
            id: 'barrier-map',
            target: targets.barrierMap,
            group: RADAR_GROUP,
            title: 'Mapa de barreiras',
            content: [
                'Mostra no mapa onde cada barreira foi encontrada.',
                'Marque ou desmarque as opções embaixo do mapa para escolher o que aparece. Clique em um ponto para ver os detalhes.',
            ],
        },
    ],
};
