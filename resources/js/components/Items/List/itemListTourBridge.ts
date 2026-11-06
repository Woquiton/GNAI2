import { useEffect } from 'react';
import type { TableListViewMode } from '@/components/Tables/TableList/TableList.preferences';
import type { GuidedTourStep } from '@/components/UI/GuidedTour/GuidedTour.types';
import { findTourTargets } from '@/components/UI/GuidedTour/guidedTourLayout';

const bridge: { show: ((view: TableListViewMode | null) => void) | null } = { show: null };

/** A demonstração altera somente a visão local, sem gravar preferências ou recarregar itens. */
export function useItemListTourBridge(show: (view: TableListViewMode | null) => void): void {
    useEffect(() => {
        bridge.show = show;
        return () => {
            bridge.show = null;
        };
    }, [show]);
}

export function itemListViewStep(
    step: GuidedTourStep,
    view: TableListViewMode,
    availableWith: GuidedTourStep['availableWith'],
    revealActions = false,
): GuidedTourStep {
    return {
        ...step,
        availableWith,
        onEnter: () => {
            const show = bridge.show;
            show?.(view);
            let undoDemo: (() => void) | undefined;
            let actions: HTMLElement | null = null;
            let frame = 0;
            let note = step.onEnter
                ? 'A visualização desta demonstração é temporária. Sua preferência continua salva.'
                : undefined;
            // Aguarda a visão renderizar antes de abrir menus ou medir os alvos do passo.
            function prepare(): void {
                const panel = document.querySelector<HTMLElement>(`[data-item-view="${view}"]`);
                if (!panel || panel.hidden) {
                    frame = requestAnimationFrame(prepare);
                    return;
                }
                const target = findTourTargets(step.target)[0] ?? null;
                if (!target) {
                    frame = requestAnimationFrame(prepare);
                    return;
                }
                if (revealActions) {
                    actions = target;
                    actions.setAttribute('data-tour-reveal', '');
                }
                const demo = step.onEnter?.(target);
                undoDemo = typeof demo === 'function' ? demo : demo?.undo;
                if (demo && typeof demo === 'object') note = demo.note;
            }
            prepare();
            return {
                note,
                undo: () => {
                    cancelAnimationFrame(frame);
                    undoDemo?.();
                    actions?.removeAttribute('data-tour-reveal');
                    show?.(null);
                },
            };
        },
    };
}
