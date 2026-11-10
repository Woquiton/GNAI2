import { pageBackActionsTourStep } from '@/components/Navigation/PageBackActions/pageBackActionsTour';
import type {
    GuidedTourDemo,
    GuidedTourPageConfig,
} from '@/components/UI/GuidedTour/GuidedTour.types';
import { helpUrls } from './Help.routes';

/** Valores de `data-tour` da busca e da visualização dos artigos da Central de Ajuda. */
export const HELP_TOUR_TARGETS = {
    search: 'help-search',
    resultTabs: 'help-result-tabs',
    categoryTab: 'help-category-tab',
    resultList: 'help-result-list',
    articleBody: 'help-article-body',
    articleSections: 'help-article-sections',
    articleRelated: 'help-article-related',
    articleActions: 'help-article-actions',
} as const;

const targets = HELP_TOUR_TARGETS;
const HELP_HREF = helpUrls.show('primeiros-passos', 'como-usar-a-central-de-ajuda');
const RESULTS_GROUP = 'Resultados';

/**
 * Abre a aba da primeira categoria dos resultados e devolve como voltar para a aba anterior. A
 * leitura espera a volta do passo anterior terminar; as abas não guardam preferência.
 */
function categoryTabDemo(tab: HTMLElement | null): GuidedTourDemo {
    if (!tab) {
        return {};
    }

    const label = tab.querySelector('.tabs__label b')?.textContent?.trim();
    let previous: HTMLElement | null = null;
    const timer = window.setTimeout(() => {
        const selected = tab
            .closest('[role="tablist"]')
            ?.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');

        if (!selected || selected === tab) {
            return;
        }

        previous = selected;
        tab.click();
    }, 0);

    return {
        note: `Abrimos a aba ${label || 'da categoria'}. Ao sair do passo, a aba anterior volta.`,
        undo: () => {
            window.clearTimeout(timer);
            previous?.click();
        },
    };
}

export const helpIndexTour: GuidedTourPageConfig = {
    helpHref: HELP_HREF,
    steps: [
        {
            id: 'help-search',
            target: targets.search,
            title: 'O que você precisa fazer?',
            content: [
                'Escreva aqui, com suas palavras, o que você quer fazer ou a sua dúvida. Por exemplo: trocar senha, emprestar item ou finalizar PEI.',
                'Os resultados se atualizam sozinhos enquanto você digita. Você também pode apertar Enter ou clicar em Buscar.',
            ],
        },
        {
            id: 'help-result-tabs',
            target: targets.resultTabs,
            group: RESULTS_GROUP,
            title: 'Categorias',
            content: [
                'Os resultados ficam separados em abas, na mesma ordem dos grupos do menu. O número em cada aba mostra quantos artigos ela tem.',
                'A aba Todos reúne tudo. Sem pesquisa, aparecem todos os artigos das telas que você pode acessar.',
            ],
        },
        {
            id: 'help-category-tab',
            target: targets.categoryTab,
            group: RESULTS_GROUP,
            title: 'Ver uma categoria',
            content: 'Clique no nome de uma categoria para ver só os artigos dela.',
            onEnter: categoryTabDemo,
        },
        {
            id: 'help-result-list',
            target: targets.resultList,
            group: RESULTS_GROUP,
            title: 'Artigos encontrados',
            content: [
                'Cada resultado mostra o título do artigo, o caminho até ele e um trecho com as palavras pesquisadas em destaque.',
                'Clique no título para abrir o artigo direto no trecho que responde à sua pesquisa.',
            ],
        },
        pageBackActionsTourStep,
    ],
};

export const helpShowTour: GuidedTourPageConfig = {
    helpHref: HELP_HREF,
    steps: [
        {
            id: 'help-article-body',
            target: targets.articleBody,
            title: 'Artigo',
            content: [
                'Aqui está a explicação completa, com o passo a passo. Os nomes em negrito são os botões e os menus da tela.',
                'Clique em um link do texto para abrir outro artigo da Central de Ajuda.',
            ],
        },
        {
            id: 'help-article-sections',
            target: targets.articleSections,
            title: 'Nesta página',
            content: 'Clique no nome de uma parte para ir direto até ela no artigo.',
        },
        {
            id: 'help-article-related',
            target: targets.articleRelated,
            title: 'Mais artigos da categoria',
            content: 'Aqui ficam os outros artigos do mesmo assunto. Clique no nome para abrir.',
        },
        {
            id: 'help-article-actions',
            target: targets.articleActions,
            title: 'Voltar',
            content: 'Clique em Voltar para retornar à pesquisa da Central de Ajuda.',
        },
    ],
};
