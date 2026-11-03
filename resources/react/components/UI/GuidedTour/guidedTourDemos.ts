import type { GuidedTourDemo } from './GuidedTour.types';

function isExpanded(button: HTMLElement | null): boolean {
    return button?.getAttribute('aria-expanded') === 'true';
}

/**
 * Abre um controle de mostrar e esconder (botão com `aria-expanded`), como o menu de colunas, e
 * devolve como fechá-lo. Se o usuário já tinha deixado aberto, nada muda e nada é desfeito.
 * `closeButton` indica outro botão para fechar, quando o que abre fica inativo depois de aberto.
 */
export function openDisclosureDemo(
    openButton: HTMLElement | null,
    options: { closeButton?: () => HTMLElement | null; note?: string } = {},
): GuidedTourDemo {
    if (!openButton || isExpanded(openButton)) {
        return {};
    }

    openButton.click();

    return {
        note: options.note,
        undo: () => {
            const closer = options.closeButton?.() ?? openButton;

            if (isExpanded(closer) || isExpanded(openButton)) {
                closer.click();
            }
        },
    };
}

/** Pressiona uma tecla no elemento, como faria o teclado; os componentes reagem normalmente. */
export function pressKey(element: HTMLElement, key: string): void {
    element.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
}
