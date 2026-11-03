import type { GuidedTourStep } from './GuidedTour.types';

export interface TourRect {
    top: number;
    left: number;
    width: number;
    height: number;
}

export interface TourCardPlacement {
    /** Telas estreitas: o cartão fica preso à base da tela, de ponta a ponta. */
    docked: boolean;
    top: number;
    left: number;
}

export interface TourLayout {
    /** Área destacada, já com a folga em volta do alvo; nula quando o passo não tem alvo. */
    spotlight: TourRect | null;
    card: TourCardPlacement;
}

const SPOTLIGHT_PADDING = 8;
const CARD_GAP = 14;
const VIEWPORT_MARGIN = 12;
const DOCK_BREAKPOINT = 768;

function isRendered(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();

    return rect.width > 0 || rect.height > 0;
}

/** Elementos destacados pelo passo: o primeiro de cada alvo que estiver visível. */
export function findTourTargets(target: GuidedTourStep['target']): HTMLElement[] {
    if (!target) {
        return [];
    }

    const ids = Array.isArray(target) ? target : [target];

    return ids
        .map((id) => document.querySelector<HTMLElement>(`[data-tour="${CSS.escape(id)}"]`))
        .filter((element): element is HTMLElement => element !== null && isRendered(element));
}

/** O passo entra no tutorial quando não tem alvo ou quando ao menos um alvo está na tela. */
export function isTourStepAvailable(step: GuidedTourStep): boolean {
    return !step.target || findTourTargets(step.target).length > 0;
}

/** Retângulo que envolve todos os elementos, nas coordenadas da janela. */
export function enclosingRect(elements: HTMLElement[]): TourRect | null {
    if (!elements.length) {
        return null;
    }

    const rects = elements.map((element) => element.getBoundingClientRect());
    const top = Math.min(...rects.map((rect) => rect.top));
    const left = Math.min(...rects.map((rect) => rect.left));
    const bottom = Math.max(...rects.map((rect) => rect.bottom));
    const right = Math.max(...rects.map((rect) => rect.right));

    return { top, left, width: right - left, height: bottom - top };
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), Math.max(min, max));
}

/**
 * Posiciona o destaque e o cartão: abaixo do alvo quando cabe, acima como segunda opção e,
 * para alvos maiores que a tela, no canto inferior direito, sobre o próprio alvo.
 */
export function computeTourLayout(
    target: TourRect | null,
    card: { width: number; height: number },
    viewport: { width: number; height: number },
    topOffset: number,
): TourLayout {
    const spotlight = target
        ? {
              top: Math.round(target.top - SPOTLIGHT_PADDING),
              left: Math.round(target.left - SPOTLIGHT_PADDING),
              width: Math.round(target.width + SPOTLIGHT_PADDING * 2),
              height: Math.round(target.height + SPOTLIGHT_PADDING * 2),
          }
        : null;

    if (viewport.width < DOCK_BREAKPOINT) {
        return { spotlight, card: { docked: true, top: 0, left: 0 } };
    }

    const maxLeft = viewport.width - card.width - VIEWPORT_MARGIN;

    if (!spotlight) {
        return {
            spotlight,
            card: {
                docked: false,
                top: Math.round(Math.max(topOffset, (viewport.height - card.height) / 2)),
                left: Math.round(
                    clamp((viewport.width - card.width) / 2, VIEWPORT_MARGIN, maxLeft),
                ),
            },
        };
    }

    const bottom = spotlight.top + spotlight.height;
    const spaceBelow = viewport.height - bottom - CARD_GAP - VIEWPORT_MARGIN;
    const spaceAbove = spotlight.top - topOffset - CARD_GAP - VIEWPORT_MARGIN;
    const left = Math.round(clamp(spotlight.left, VIEWPORT_MARGIN, maxLeft));

    if (spaceBelow >= card.height) {
        return { spotlight, card: { docked: false, top: Math.round(bottom + CARD_GAP), left } };
    }

    if (spaceAbove >= card.height) {
        return {
            spotlight,
            card: { docked: false, top: Math.round(spotlight.top - CARD_GAP - card.height), left },
        };
    }

    return {
        spotlight,
        card: {
            docked: false,
            top: Math.round(Math.max(topOffset, viewport.height - card.height - VIEWPORT_MARGIN)),
            left: Math.round(Math.max(VIEWPORT_MARGIN, maxLeft)),
        },
    };
}

/** Altura da barra fixa do topo, para o cartão nunca ficar escondido atrás dela. */
export function topBarOffset(): number {
    const value = getComputedStyle(document.documentElement).getPropertyValue('--ui-topbar-height');

    return (Number.parseFloat(value) || 0) + VIEWPORT_MARGIN;
}
