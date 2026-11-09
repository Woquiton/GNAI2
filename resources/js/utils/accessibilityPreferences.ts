/**
 * Preferências de acessibilidade aplicadas ao documento inteiro.
 *
 * - `data-focus-mode`: `keyboard` quando a última interação foi pelo teclado e `pointer`
 *   quando foi por mouse, toque ou caneta. O CSS usa esse atributo para mostrar o anel de
 *   foco reforçado somente na navegação por teclado (WCAG 2.4.7 e 2.4.11; eMAG 3.1).
 */

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

export interface AccessibilityPreferences {
    highContrast: boolean;
    scale: number;
}

const PREFERENCES_KEY = 'gnai.accessibility';
const PREFERENCES_EVENT = 'gnai:accessibility';
export const MIN_ACCESSIBILITY_SCALE = 90;
export const MAX_ACCESSIBILITY_SCALE = 150;

export function readAccessibilityPreferences(): AccessibilityPreferences {
    try {
        const saved = JSON.parse(localStorage.getItem(PREFERENCES_KEY) ?? '{}');
        return {
            highContrast: saved?.highContrast === true,
            scale: [90, 100, 110, 120, 130, 140, 150].includes(saved?.scale)
                ? saved.scale
                : 100,
        };
    } catch {
        return { highContrast: false, scale: 100 };
    }
}

export function applyAccessibilityPreferences(preferences: AccessibilityPreferences): void {
    document.documentElement.dataset.highContrast = String(preferences.highContrast);
    document.documentElement.style.setProperty('--ui-accessibility-scale', String(preferences.scale / 100));
}

export function saveAccessibilityPreferences(preferences: AccessibilityPreferences): void {
    applyAccessibilityPreferences(preferences);
    try {
        localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
    } catch {
        // A preferência continua ativa mesmo quando o navegador bloqueia armazenamento.
    }
    window.dispatchEvent(new CustomEvent(PREFERENCES_EVENT, { detail: preferences }));
}

export function subscribeAccessibilityPreferences(
    listener: (preferences: AccessibilityPreferences) => void,
): () => void {
    const changed = (event: Event): void => {
        listener((event as CustomEvent<AccessibilityPreferences>).detail);
    };
    const stored = (event: StorageEvent): void => {
        if (event.key === PREFERENCES_KEY || event.key === null) {
            const preferences = readAccessibilityPreferences();
            applyAccessibilityPreferences(preferences);
            listener(preferences);
        }
    };
    window.addEventListener(PREFERENCES_EVENT, changed);
    window.addEventListener('storage', stored);
    return () => {
        window.removeEventListener(PREFERENCES_EVENT, changed);
        window.removeEventListener('storage', stored);
    };
}
