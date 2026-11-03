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

/**
 * Elementos destacados pelo passo: para cada alvo, o primeiro que estiver visível. Um mesmo alvo
 * pode marcar versões diferentes do controle, como a de telas largas e a do celular.
 */
export function findTourTargets(target: GuidedTourStep['target']): HTMLElement[] {
    if (!target) {
        return [];
    }

    const ids = Array.isArray(target) ? target : [target];

    return ids
        .map((id) =>
            Array.from(
                document.querySelectorAll<HTMLElement>(`[data-tour="${CSS.escape(id)}"]`),
            ).find(isRendered),
        )
        .filter((element): element is HTMLElement => element !== undefined);
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

/** Área do cartão na tela, para medir quanto ele cobre do alvo. */
function overlapArea(
    card: { top: number; left: number; width: number; height: number },
    target: TourRect,
): number {
    const width =
        Math.min(card.left + card.width, target.left + target.width) -
        Math.max(card.left, target.left);
    const height =
        Math.min(card.top + card.height, target.top + target.height) -
        Math.max(card.top, target.top);

    return Math.max(0, width) * Math.max(0, height);
}

/**
 * Posiciona o destaque e o cartão sem cobrir o alvo: abaixo dele, acima, à esquerda ou à direita,
 * nessa ordem. Quando nenhum lado comporta o cartão (alvo maior que a tela), ele vai para o canto
 * inferior do lado oposto ao alvo, a posição que cobre a menor parte dele.
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

    const minLeft = VIEWPORT_MARGIN;
    const maxLeft = viewport.width - card.width - VIEWPORT_MARGIN;
    const minTop = topOffset;
    const maxTop = viewport.height - card.height - VIEWPORT_MARGIN;
    const place = (top: number, left: number): TourLayout => ({
        spotlight,
        card: {
            docked: false,
            top: Math.round(clamp(top, minTop, maxTop)),
            left: Math.round(clamp(left, minLeft, maxLeft)),
        },
    });

    if (!spotlight) {
        return place((viewport.height - card.height) / 2, (viewport.width - card.width) / 2);
    }

    const right = spotlight.left + spotlight.width;
    const bottom = spotlight.top + spotlight.height;
    const fitsBelow = viewport.height - bottom - CARD_GAP - VIEWPORT_MARGIN >= card.height;
    const fitsAbove = spotlight.top - topOffset - CARD_GAP >= card.height;
    const fitsLeft = spotlight.left - CARD_GAP - VIEWPORT_MARGIN >= card.width;
    const fitsRight = viewport.width - right - CARD_GAP - VIEWPORT_MARGIN >= card.width;

    if (fitsBelow) {
        return place(bottom + CARD_GAP, spotlight.left);
    }

    if (fitsAbove) {
        return place(spotlight.top - CARD_GAP - card.height, spotlight.left);
    }

    if (fitsLeft) {
        return place(spotlight.top, spotlight.left - CARD_GAP - card.width);
    }

    if (fitsRight) {
        return place(spotlight.top, right + CARD_GAP);
    }

    const corners = [
        place(maxTop, minLeft),
        place(maxTop, maxLeft),
        place(minTop, minLeft),
        place(minTop, maxLeft),
    ];

    return corners.reduce((best, candidate) =>
        overlapArea({ ...candidate.card, ...card }, spotlight) <
        overlapArea({ ...best.card, ...card }, spotlight)
            ? candidate
            : best,
    );
}

/** Altura da barra fixa do topo, para o cartão nunca ficar escondido atrás dela. */
export function topBarOffset(): number {
    const value = getComputedStyle(document.documentElement).getPropertyValue('--ui-topbar-height');

    return (Number.parseFloat(value) || 0) + VIEWPORT_MARGIN;
}
