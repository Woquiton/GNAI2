import type { GuidedTourStep } from '@/components/UI/GuidedTour/GuidedTour.types';

export const PAGE_BACK_ACTIONS_TOUR_TARGET = 'page-back-actions';

export const pageBackActionsTourStep: GuidedTourStep = {
    id: PAGE_BACK_ACTIONS_TOUR_TARGET,
    target: PAGE_BACK_ACTIONS_TOUR_TARGET,
    title: 'Voltar',
    content: 'Clique em Voltar para retornar à página inicial da sua área.',
};
