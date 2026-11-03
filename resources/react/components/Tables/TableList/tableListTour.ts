import type { GuidedTourDemo, GuidedTourStep } from '@/components/UI/GuidedTour/GuidedTour.types';
import { openDisclosureDemo, pressKey } from '@/components/UI/GuidedTour/guidedTourDemos';

/** Valores de `data-tour` das peças comuns das listagens. */
export const TABLE_LIST_TOUR_TARGETS = {
    filters: 'table-list-filters',
    moreFilters: 'table-list-more-filters',
    clear: 'table-list-clear',
    columns: 'table-list-columns',
    columnsOptions: 'table-list-columns-options',
    table: 'table-list-table',
    resize: 'table-list-resize',
    rowActions: 'table-list-row-actions',
    pageSize: 'table-list-page-size',
    pagination: 'table-list-pagination',
} as const;

const targets = TABLE_LIST_TOUR_TARGETS;

/** Textos que a tela pode trocar para falar dos próprios registros. */
export interface TableListTourTexts {
    filters?: string | string[];
    moreFilters?: string | string[];
    table?: string | string[];
}

const FILTERS_GROUP = 'Filtros';
const TABLE_GROUP = 'Tabela';
const PAGES_GROUP = 'Páginas';

/** Quantas vezes a seta é pressionada na demonstração; cada toque move a linha 10 px. */
const RESIZE_DEMO_PRESSES = 8;
const RESIZE_DEMO_INTERVAL_MS = 70;
const RESIZE_UNDO_INTERVAL_MS = 30;

function headingOf(cell: Element | null | undefined): string {
    return cell?.querySelector('.tableListTable__heading')?.textContent?.trim() ?? '';
}

/**
 * Arrasta a linha entre duas colunas para um lado sorteado, aos poucos, e devolve como voltar.
 * A largura das colunas não é salva: a demonstração some ao sair do passo.
 */
function resizeDemo(handle: HTMLElement | null): GuidedTourDemo {
    if (!handle) {
        return {};
    }

    const toRight = Math.random() < 0.5;
    const key = toRight ? 'ArrowRight' : 'ArrowLeft';
    const backKey = toRight ? 'ArrowLeft' : 'ArrowRight';
    const column = headingOf(handle.closest('th')?.previousElementSibling);
    let pressed = 0;
    const timer = window.setInterval(() => {
        pressKey(handle, key);
        pressed += 1;

        if (pressed >= RESIZE_DEMO_PRESSES) {
            window.clearInterval(timer);
        }
    }, RESIZE_DEMO_INTERVAL_MS);

    const direction = toRight ? 'direita' : 'esquerda';
    const leftColumn = column ? `a coluna "${column}"` : 'a coluna da esquerda';

    return {
        note: `A linha foi arrastada para a ${direction}: ${leftColumn} ficou mais ${toRight ? 'larga' : 'estreita'}.`,
        // Cada toque mede as colunas já atualizadas; por isso a volta também é espaçada.
        undo: () => {
            window.clearInterval(timer);

            for (let index = 0; index < pressed; index += 1) {
                window.setTimeout(() => pressKey(handle, backKey), index * RESIZE_UNDO_INTERVAL_MS);
            }
        },
    };
}

/**
 * Passos padrão das listagens, na ordem da tela: filtros, colunas, tabela e páginas. Passos cujo
 * controle não está na tela (sem "Mais filtros", sem registros, uma página só) saem sozinhos.
 */
export function tableListTourSteps(texts: TableListTourTexts = {}): GuidedTourStep[] {
    return [
        {
            id: 'table-list-filters',
            target: targets.filters,
            group: FILTERS_GROUP,
            title: 'Filtros',
            content: texts.filters ?? [
                'Use estes campos para encontrar o que procura. O primeiro campo é a pesquisa.',
                'A lista se atualiza sozinha enquanto você digita ou escolhe uma opção.',
            ],
        },
        {
            id: 'table-list-more-filters',
            target: targets.moreFilters,
            group: FILTERS_GROUP,
            title: 'Mais filtros',
            content: texts.moreFilters ?? [
                'Aqui ficam outros filtros, que não cabem na linha principal.',
                'O número ao lado do nome mostra quantos desses filtros estão em uso.',
            ],
            onEnter: (target) =>
                openDisclosureDemo(target?.querySelector('button') ?? null, {
                    note: 'Abrimos a área para você ver. Ela fecha de novo no próximo passo.',
                }),
        },
        {
            id: 'table-list-clear',
            target: targets.clear,
            group: FILTERS_GROUP,
            title: 'Limpar filtros',
            content: [
                'O botão com a borracha apaga todos os filtros de uma vez.',
                'Use quando quiser ver a lista completa de novo.',
            ],
        },
        {
            id: 'table-list-columns',
            target: targets.columns,
            group: TABLE_GROUP,
            title: 'Colunas',
            content: [
                'Este botão escolhe quais colunas aparecem na tabela.',
                'Clique em Próximo para ver as opções.',
            ],
        },
        {
            id: 'table-list-columns-options',
            target: [targets.columns, targets.columnsOptions],
            group: TABLE_GROUP,
            title: 'Escolher colunas',
            content: [
                'Marque uma coluna para mostrar e desmarque para esconder. Algumas colunas, como as ações, ficam sempre à mostra.',
                'Sua escolha fica salva. Mesmo se você recarregar a página ou sair do sistema, a tabela volta do jeito que você deixou.',
            ],
            onEnter: (target) =>
                openDisclosureDemo(target?.querySelector('button') ?? null, {
                    note: 'Abrimos as opções para você ver. Elas fecham no próximo passo.',
                }),
        },
        {
            id: 'table-list-table',
            target: targets.table,
            group: TABLE_GROUP,
            title: 'Tabela',
            content: texts.table ?? 'Cada linha da tabela é um registro.',
        },
        {
            id: 'table-list-resize',
            target: targets.resize,
            group: TABLE_GROUP,
            title: 'Largura das colunas',
            content: [
                'Esta linha fica entre os títulos de duas colunas.',
                'Arraste a linha para os lados para deixar uma coluna mais larga e a outra mais estreita. Pelo teclado, selecione a linha e use as setas.',
            ],
        },
        {
            id: 'table-list-resize-demo',
            target: targets.resize,
            group: TABLE_GROUP,
            title: 'Veja como funciona',
            content:
                'Arrastamos a linha para você ver. No próximo passo, as colunas voltam ao normal.',
            onEnter: resizeDemo,
        },
        {
            id: 'table-list-row-actions',
            target: targets.rowActions,
            group: TABLE_GROUP,
            title: 'Ações de cada linha',
            content: [
                'Cada linha tem botões para trabalhar com aquele registro, como visualizar ou excluir.',
                'Passe o mouse sobre um botão para ver o nome dele. Alguns botões só aparecem para quem tem permissão.',
            ],
        },
        {
            id: 'table-list-page-size',
            target: targets.pageSize,
            group: PAGES_GROUP,
            title: 'Registros por página',
            content: [
                'Escolha quantos registros aparecem em cada página.',
                'Sua escolha fica salva para esta tela, mesmo depois de sair do sistema.',
            ],
        },
        {
            id: 'table-list-pagination',
            target: targets.pagination,
            group: PAGES_GROUP,
            title: 'Páginas',
            content: 'Use os números para passar de uma página para outra.',
        },
    ];
}
