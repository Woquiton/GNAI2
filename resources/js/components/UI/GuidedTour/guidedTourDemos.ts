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

/**
 * Demonstração que continua entre passos seguidos, como uma janela aberta que vários passos
 * explicam. Cada passo chama `hold` ao entrar e `release` ao sair: se o próximo passo também
 * participa, ele segura a demonstração; senão, `reset` desfaz tudo logo depois.
 */
export function createDemoSession(
    reset: () => void,
    delayMs = 80,
): {
    hold: () => void;
    release: () => void;
} {
    let timer = 0;

    return {
        hold: () => window.clearTimeout(timer),
        release: () => {
            window.clearTimeout(timer);
            timer = window.setTimeout(reset, delayMs);
        },
    };
}
