import { pageBreadcrumbTourStep } from '@/components/Navigation/PageBreadcrumb/pageBreadcrumbTour';
import {
    pageActionsTourStep,
    pageTitleTourStep,
} from '@/components/Navigation/PageTitle/pageTitleTour';
import type {
    GuidedTourDefinition,
    GuidedTourPageConfig,
} from '@/components/UI/GuidedTour/GuidedTour.types';

/**
 * Tutorial completo da tela: começa pela moldura comum (trilha, nome e ações) e segue com os passos
 * da página. A ação some do tutorial sozinha quando a tela não tem botões no cabeçalho.
 */
export function businessPageTour(title: string, page: GuidedTourPageConfig): GuidedTourDefinition {
    return {
        title,
        helpHref: page.helpHref,
        steps: [pageBreadcrumbTourStep, pageTitleTourStep, pageActionsTourStep, ...page.steps],
    };
}
