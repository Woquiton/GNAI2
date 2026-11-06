import { helpUrls } from '@/components/Help/Help.routes';
import type { TableListTourConfig } from '@/components/Tables/TableList/TableList';
import { TABLE_LIST_TOUR_TARGETS } from '@/components/Tables/TableList/tableListTour';
import type { GuidedTourDemo } from '@/components/UI/GuidedTour/GuidedTour.types';
import { createDemoSession } from '@/components/UI/GuidedTour/guidedTourDemos';

const HELP_SLUG = 'auditoria';

/** Valores de `data-tour` da janela de detalhes de uma operação. */
export const AUDIT_TOUR_TARGETS = {
    modalSummary: 'audit-modal-summary',
    modalViews: 'audit-modal-views',
    modalContent: 'audit-modal-content',
    modalFooter: 'audit-modal-footer',
} as const;

const targets = AUDIT_TOUR_TARGETS;
const DETAILS_GROUP = 'Detalhes da operação';
const MODAL_SELECTOR = '.auditRecordModal';
const CLOSE_SELECTOR = '[aria-label="Fechar detalhes do registro"]';

function modalIsOpen(): boolean {
    return document.querySelector(MODAL_SELECTOR) !== null;
}

/**
 * Janela de detalhes aberta pelo tutorial: os passos seguidos da janela a mantêm aberta, e ela
 * fecha ao sair do último deles ou ao fechar o tutorial. Se o usuário já tinha aberto uma janela,
 * o tutorial não a fecha.
 */
const modalDemo = { opened: false };
const modalSession = createDemoSession(() => {
    if (modalDemo.opened && modalIsOpen()) {
        document.querySelector<HTMLElement>(CLOSE_SELECTOR)?.click();
    }

    modalDemo.opened = false;
});

/** Clica no botão de olho da primeira linha, como o usuário faria. */
function openRecordDemo(): GuidedTourDemo {
    modalSession.hold();

    if (!modalIsOpen()) {
        const view = document.querySelector<HTMLElement>(
            `[data-tour="${TABLE_LIST_TOUR_TARGETS.rowActions}"] button`,
        );

        if (view) {
            view.click();
            modalDemo.opened = true;
        }
    }

    return {
        note: modalDemo.opened
            ? 'Abrimos os detalhes da primeira operação da lista para você ver. A janela fecha no fim desta parte do tutorial.'
            : undefined,
        undo: modalSession.release,
    };
}

/** Botões Formatado e Log técnico, nessa ordem, dentro da janela aberta. */
function viewButtons(): HTMLElement[] {
    const group = document.querySelector(`[data-tour="${targets.modalViews}"]`);

    return Array.from(group?.querySelectorAll<HTMLElement>('button') ?? []);
}

/** Mostra o Log técnico e volta para Formatado ao sair do passo. */
function technicalViewDemo(): GuidedTourDemo {
    const base = openRecordDemo();
    let switched = false;
    // A janela pode estar abrindo agora; espera os botões aparecerem.
    const timer = window.setTimeout(() => {
        const [, technical] = viewButtons();

        if (technical && technical.getAttribute('aria-pressed') !== 'true') {
            technical.click();
            switched = true;
        }
    }, 150);

    return {
        note: 'Mostramos o Log técnico para você ver. A forma Formatado volta no próximo passo.',
        undo: () => {
            window.clearTimeout(timer);

            if (switched) {
                viewButtons()[0]?.click();
            }

            base.undo?.();
        },
    };
}

/**
 * Histórico de alterações. Os passos finais abrem os detalhes da primeira operação, explicam
 * cada parte da janela e a fecham ao sair.
 */
export const auditListTour: TableListTourConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'consultar-o-historico-de-alteracoes'),
    filters: [
        'Em O que você procura?, digite o nome do registro alterado ou o nome de quem fez a operação.',
        'Use De e Até para escolher um período e Quem fez para ver só as operações de uma pessoa ou do Sistema. A lista se atualiza sozinha.',
    ],
    moreFilters:
        'Clique em Mais filtros para escolher o Tipo de registro, como Aluno ou Empréstimo, e a Ação: Criação, Alteração, Exclusão ou Restauração.',
    table: [
        'Cada linha é uma operação, das mais recentes para as mais antigas. Você vê o registro, a ação, o tipo, quem fez e quando.',
        'Quando a operação veio de uma rotina automática, Quem fez mostra Sistema. O histórico é só para consulta e não pode ser alterado.',
    ],
    steps: [
        {
            id: 'audit-record-details',
            target: TABLE_LIST_TOUR_TARGETS.rowActions,
            group: DETAILS_GROUP,
            title: 'Ver o que mudou',
            content:
                'Clique no botão de olho de uma linha para abrir os detalhes daquela operação. Clique em Próximo para ver como é a janela.',
        },
        {
            id: 'audit-modal-summary',
            target: targets.modalSummary,
            availableWith: TABLE_LIST_TOUR_TARGETS.rowActions,
            group: DETAILS_GROUP,
            title: 'Resumo da operação',
            content: [
                'No alto da janela fica a frase que resume o que aconteceu.',
                'As etiquetas mostram a ação, como Criação ou Alteração, e o tipo de registro. Ao lado, a data e a hora da operação.',
            ],
            onEnter: openRecordDemo,
        },
        {
            id: 'audit-modal-content',
            target: targets.modalContent,
            availableWith: TABLE_LIST_TOUR_TARGETS.rowActions,
            group: DETAILS_GROUP,
            title: 'Campos alterados',
            content: [
                'Cada linha é um campo do registro. Nas alterações, você vê o valor Antes e o valor Depois.',
                'Nas criações aparece o Valor registrado e nas exclusões, o Valor ao excluir. Nas listas, o sinal de mais indica o que entrou e o de menos, o que saiu.',
            ],
            onEnter: openRecordDemo,
        },
        {
            id: 'audit-modal-views',
            target: targets.modalViews,
            availableWith: TABLE_LIST_TOUR_TARGETS.rowActions,
            group: DETAILS_GROUP,
            title: 'Formatado ou Log técnico',
            content: [
                'Formatado mostra a operação em linguagem simples. É a forma que abre primeiro.',
                'Log técnico mostra os dados exatamente como foram gravados. Ele ajuda o suporte a investigar um problema.',
            ],
            onEnter: technicalViewDemo,
        },
        {
            id: 'audit-modal-footer',
            target: targets.modalFooter,
            availableWith: TABLE_LIST_TOUR_TARGETS.rowActions,
            group: DETAILS_GROUP,
            title: 'Fechar os detalhes',
            content: [
                'Clique em Fechar para voltar à lista. O histórico é só para consulta: nada pode ser alterado aqui.',
                'Ao sair deste passo, a janela que abrimos para você fecha sozinha.',
            ],
            onEnter: openRecordDemo,
        },
    ],
};
