import type { GuidedTourStep } from '@/components/UI/GuidedTour/GuidedTour.types';

/** Valores de `data-tour` do cabeçalho da página e da área de ações à direita do título. */
export const PAGE_TITLE_TOUR_TARGET = 'page-title';
export const PAGE_ACTIONS_TOUR_TARGET = 'page-actions';

export const pageTitleTourStep: GuidedTourStep = {
    id: 'page-title',
    target: PAGE_TITLE_TOUR_TARGET,
    title: 'Nome da tela',
    content: 'Aqui fica o nome da tela em que você está e uma frase curta sobre ela.',
};

/** Só entra no tutorial quando a tela tem ações no cabeçalho, como "Cadastrar". */
export const pageActionsTourStep: GuidedTourStep = {
    id: 'page-actions',
    target: PAGE_ACTIONS_TOUR_TARGET,
    title: 'Ações da tela',
    content: 'Estes botões fazem as ações principais desta tela, como cadastrar um novo registro.',
};
