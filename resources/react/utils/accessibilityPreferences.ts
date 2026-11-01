/**
 * Preferências de acessibilidade aplicadas ao documento inteiro.
 *
 * - `data-focus-mode`: `keyboard` quando a última interação foi pelo teclado e `pointer`
 *   quando foi por mouse, toque ou caneta. O CSS usa esse atributo para mostrar o anel de
 *   foco reforçado somente na navegação por teclado (WCAG 2.4.7 e 2.4.11; eMAG 3.1).
 * - `data-contrast="high"`: modo de alto contraste, no mesmo modelo do gov.br, salvo no navegador.
 */

const CONTRAST_STORAGE_KEY = 'gnai.highContrast';

/** Teclas que movem o foco ou percorrem opções; digitar texto não muda o modo. */
const NAVIGATION_KEYS = new Set([
    'Tab',
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'Home',
    'End',
    'PageUp',
    'PageDown',
]);

let focusModalityInstalled = false;

function setFocusMode(mode: 'keyboard' | 'pointer'): void {
    if (document.documentElement.dataset.focusMode !== mode) {
        document.documentElement.dataset.focusMode = mode;
    }
}

/** Indica se a última interação foi pelo teclado. */
export function isKeyboardFocusMode(): boolean {
    return document.documentElement.dataset.focusMode === 'keyboard';
}

/** Registra uma única vez os ouvintes que distinguem foco por teclado e por ponteiro. */
export function installFocusModality(): void {
    if (focusModalityInstalled) {
        return;
    }

    focusModalityInstalled = true;
    setFocusMode('pointer');

    document.addEventListener(
        'keydown',
        (event: KeyboardEvent) => {
            // Teclas de acesso (Alt + número) também são navegação por teclado.
            if (NAVIGATION_KEYS.has(event.key) || (event.altKey && /^\d$/.test(event.key))) {
                setFocusMode('keyboard');
            }
        },
        true,
    );
    document.addEventListener('pointerdown', () => setFocusMode('pointer'), true);
}

export function storedHighContrast(): boolean {
    try {
        return window.localStorage.getItem(CONTRAST_STORAGE_KEY) === 'true';
    } catch {
        return false;
    }
}

export function applyHighContrast(enabled: boolean): void {
    if (enabled) {
        document.documentElement.dataset.contrast = 'high';
    } else {
        delete document.documentElement.dataset.contrast;
    }
}

export function saveHighContrast(enabled: boolean): void {
    applyHighContrast(enabled);

    try {
        window.localStorage.setItem(CONTRAST_STORAGE_KEY, String(enabled));
    } catch {
        // Sem armazenamento, o modo continua valendo até a página ser recarregada.
    }
}
