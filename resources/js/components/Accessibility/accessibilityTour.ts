import type { GuidedTourPageConfig } from '@/components/UI/GuidedTour/GuidedTour.types';

export const ACCESSIBILITY_TOUR_TARGETS = {
    intro: 'accessibility-resources',
    appearance: 'accessibility-appearance',
    keyboard: 'accessibility-keyboard',
    shortcuts: 'accessibility-shortcuts',
    support: 'accessibility-support',
} as const;

export const accessibilityTour: GuidedTourPageConfig = {
    steps: [
        {
            id: 'accessibility-resources',
            target: ACCESSIBILITY_TOUR_TARGETS.intro,
            title: 'Seu jeito de navegar',
            content: [
                'Conheça os recursos para usar o Gnai com mais conforto.',
                'As opções de contraste e tamanho ficam no ícone de acessibilidade da barra superior.',
            ],
        },
        {
            id: 'appearance',
            target: ACCESSIBILITY_TOUR_TARGETS.appearance,
            title: 'Contraste e tamanho',
            content: [
                'Veja como ajustar as cores e o tamanho do texto e dos controles.',
                'Sua escolha fica salva neste navegador.',
            ],
        },
        {
            id: 'keyboard',
            target: ACCESSIBILITY_TOUR_TARGETS.keyboard,
            title: 'Navegação por teclado',
            content: [
                'Consulte as teclas para percorrer controles, ativar ações e fechar janelas.',
            ],
        },
        {
            id: 'shortcuts',
            target: ACCESSIBILITY_TOUR_TARGETS.shortcuts,
            title: 'Caminhos mais curtos',
            content: [
                'Use a barra de atalhos para ir ao conteúdo, à página inicial, ao menu ou ao rodapé.',
            ],
        },
        {
            id: 'support',
            target: ACCESSIBILITY_TOUR_TARGETS.support,
            title: 'Apoio durante o uso',
            content: [
                'Conheça os recursos de leitura, movimento reduzido e orientação.',
                'A Central de Ajuda reúne instruções de uso.',
            ],
        },
    ],
};
