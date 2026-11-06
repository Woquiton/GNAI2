import type { ReactNode } from 'react';

export type GeoPoint = {
    latitude: number;
    longitude: number;
};

/** Ponto de referência exibido em cinza ao redor da sede. */
export type GeoMapMarker = GeoPoint & {
    id: number;
    label: string;
};

/** Instituição que define o enquadramento (coordenadas e `default_zoom`) e os marcadores de apoio. */
export type GeoMapReference = GeoPoint & {
    id: number;
    name: string;
    default_zoom?: number;
    locations?: GeoMapMarker[];
};

export interface GeoMapProps {
    title: string;
    /** Posição real do marcador selecionado. */
    value: GeoPoint;
    /** Zoom usado quando não há instituição de referência com `default_zoom`. */
    zoom: number;
    editable?: boolean;
    interactionEnabled?: boolean;
    height?: number;
    markerLabel: string;
    reference?: GeoMapReference | null;
    /** Ponto de referência omitido dos marcadores de apoio (o próprio registro em edição). */
    excludedLocationId?: number;
    showReferenceMarkers?: boolean;
    /** Erro de validação das coordenadas, exibido abaixo do mapa. */
    error?: string;
    /** Mensagem sobreposta ao mapa quando ele não se aplica ou depende de outro campo. */
    lockedMessage?: ReactNode;
    /** Título do aviso sobre o mapa, acima de `lockedMessage`. */
    lockedTitle?: string;
    onChange?: (point: GeoPoint) => void;
    onBlockedInteraction?: () => void;
    onZoomChange?: (zoom: number) => void;
}

/* Subconjunto da API do Leaflet (`window.L`) usado pelo adaptador. */

export type LeafletEvent = {
    latlng?: { lat: number; lng: number };
    target?: { getLatLng(): { lat: number; lng: number }; getZoom?(): number };
};

export type LeafletLayer = {
    addTo(map: LeafletMap | LeafletLayerGroup): LeafletLayer;
    bindTooltip(text: string, options?: Record<string, unknown>): LeafletLayer;
    setLatLng(point: [number, number]): void;
    on(event: string, handler: (event: LeafletEvent) => void): void;
    dragging?: { enable(): void; disable(): void };
    getElement(): HTMLElement | undefined;
};

export type LeafletLayerGroup = {
    addTo(map: LeafletMap): LeafletLayerGroup;
    addLayer(layer: LeafletLayer): void;
    clearLayers(): void;
};

export type LeafletMap = {
    remove(): void;
    invalidateSize(): void;
    flyTo(point: [number, number], zoom?: number, options?: Record<string, unknown>): void;
    setView(point: [number, number], zoom?: number): void;
    getZoom(): number;
    getSize(): { x: number; y: number };
    addLayer(layer: LeafletLayer | LeafletLayerGroup): void;
    removeLayer(layer: LeafletLayer | LeafletLayerGroup): void;
    on(event: string, handler: (event: LeafletEvent) => void): void;
};

export type LeafletRuntime = {
    map(element: HTMLElement, options: Record<string, unknown>): LeafletMap;
    tileLayer(url: string, options: Record<string, unknown>): LeafletLayer;
    marker(point: [number, number], options?: Record<string, unknown>): LeafletLayer;
    divIcon(options: Record<string, unknown>): unknown;
    layerGroup(): LeafletLayerGroup;
    control: {
        layers(layers: Record<string, LeafletLayer>): {
            addTo(map: LeafletMap): void;
        };
    };
};
