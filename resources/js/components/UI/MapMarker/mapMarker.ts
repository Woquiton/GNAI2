import { joinClassNames } from '@/utils/joinClassNames';
import '@styles/components/UI/MapMarker/MapMarker.css';

/** Parte do Leaflet (`window.L`) necessária para montar o ícone. */
interface DivIconFactory {
    divIcon(options: Record<string, unknown>): unknown;
}

interface MapMarkerIconOptions {
    /** Cor do ponto: valor CSS, inclusive `var(--token)`. */
    color: string;
    /** Anel pulsante que destaca o ponto ativo (o registro em foco, as barreiras do painel). */
    pulse?: boolean;
    /** `sm` para pontos de apoio, como os locais de referência ao redor da sede. */
    size?: 'sm' | 'md';
}

const ICON_SIZE = { sm: 18, md: 24 } as const;

/**
 * Ícone de ponto dos mapas do Gnai: círculo da cor indicada, borda branca e sombra. Use com
 * `leaflet.marker(ponto, { icon, keyboard: true })` e depois `describeMapMarker` no elemento.
 */
export function mapMarkerIcon(
    leaflet: DivIconFactory,
    { color, pulse = false, size = 'md' }: MapMarkerIconOptions,
): unknown {
    const pixels = ICON_SIZE[size];
    const half = pixels / 2;

    return leaflet.divIcon({
        className: joinClassNames('mapMarker', `mapMarker--${size}`),
        html: `<span class="mapMarker__body" style="--map-marker-color: ${color}">${
            pulse ? '<span class="mapMarker__pulse"></span>' : ''
        }<span class="mapMarker__dot"></span></span>`,
        iconSize: [pixels, pixels],
        iconAnchor: [half, half],
        popupAnchor: [0, -(half + 2)],
        tooltipAnchor: [0, -(half + 2)],
    });
}

/**
 * Nome acessível e dica do marcador. Com `onActivate`, o Espaço também o aciona: o Leaflet torna o
 * marcador um botão focável (`keyboard: true`), mas só trata o Enter.
 */
export function describeMapMarker(
    element: HTMLElement | undefined,
    label: string,
    onActivate?: () => void,
): void {
    if (!element) return;

    element.setAttribute('aria-label', label);
    element.setAttribute('title', label);

    if (onActivate) {
        element.addEventListener('keydown', (event) => {
            if (event.key === ' ') {
                event.preventDefault();
                onActivate();
            }
        });
    }
}
