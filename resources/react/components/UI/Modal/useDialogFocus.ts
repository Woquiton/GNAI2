import { useEffect, type RefObject } from 'react';

const FOCUSABLE = [
    'button:not(:disabled)',
    'a[href]',
    'input:not(:disabled):not([type="hidden"])',
    'select:not(:disabled)',
    'textarea:not(:disabled)',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
].join(', ');

function focusableElements(dialog: HTMLElement): HTMLElement[] {
    return Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (element) => element.offsetParent !== null || element === document.activeElement,
    );
}

/**
 * Foco de diálogo modal conforme o padrão WAI-ARIA: move o foco para dentro ao abrir, mantém a
 * navegação por Tab no diálogo e devolve o foco ao elemento que o abriu ao fechar.
 */
export function useDialogFocus(
    dialogRef: RefObject<HTMLElement | null>,
    active: boolean,
    initialFocusSelector?: string,
): void {
    useEffect(() => {
        if (!active) {
            return;
        }

        const opener =
            document.activeElement instanceof HTMLElement ? document.activeElement : null;
        let frame = 0;
        let attempts = 0;

        // As animações de entrada podem manter o diálogo invisível por alguns quadros; tenta até
        // o foco realmente entrar no diálogo.
        function moveFocusInside(): void {
            const dialog = dialogRef.current;

            if (!dialog || dialog.contains(document.activeElement)) {
                return;
            }

            const preferred = initialFocusSelector
                ? dialog.querySelector<HTMLElement>(initialFocusSelector)
                : null;
            const target = preferred ?? focusableElements(dialog)[0] ?? dialog;

            target.focus();

            if (!dialog.contains(document.activeElement) && attempts++ < 30) {
                frame = requestAnimationFrame(moveFocusInside);
            }
        }

        frame = requestAnimationFrame(moveFocusInside);

        function trapFocus(event: KeyboardEvent): void {
            const dialog = dialogRef.current;

            if (event.key !== 'Tab' || !dialog) {
                return;
            }

            const controls = focusableElements(dialog);

            if (!controls.length) {
                event.preventDefault();
                dialog.focus();
                return;
            }

            const first = controls[0];
            const last = controls[controls.length - 1];
            const current = document.activeElement;

            if (event.shiftKey && (current === first || !dialog.contains(current))) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && (current === last || !dialog.contains(current))) {
                event.preventDefault();
                first.focus();
            }
        }

        document.addEventListener('keydown', trapFocus);

        return () => {
            cancelAnimationFrame(frame);
            document.removeEventListener('keydown', trapFocus);

            if (opener?.isConnected) {
                opener.focus();
            }
        };
    }, [active, dialogRef, initialFocusSelector]);
}
