import type { GuidedTourStep } from '@/components/UI/GuidedTour/GuidedTour.types';

/** Valor de `data-tour` da trilha de navegação montada por `BusinessPage`. */
export const PAGE_BREADCRUMB_TOUR_TARGET = 'page-breadcrumb';

/** Explicação da trilha de navegação, igual em todas as telas. */
export const pageBreadcrumbTourStep: GuidedTourStep = {
    id: 'page-breadcrumb',
    target: PAGE_BREADCRUMB_TOUR_TARGET,
    title: 'Trilha de navegação',
    content: [
        'Esta linha mostra o caminho até a tela em que você está, como uma trilha.',
        'Clique em um nome da trilha para voltar àquela tela. O último nome é a tela em que você está agora.',
    ],
};
