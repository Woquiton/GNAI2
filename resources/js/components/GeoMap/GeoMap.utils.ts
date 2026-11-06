import type { GeoPoint } from './GeoMap.types';

/** Centro do Brasil: enquadramento quando não há instituição nem coordenadas válidas. */
export const GEO_MAP_DEFAULT_CENTER: GeoPoint = { latitude: -14.235, longitude: -51.9253 };

/** Casas decimais gravadas nas coordenadas e exibidas nas visualizações. */
const COORDINATE_DIGITS = 8;

export function isValidGeoPoint(point: GeoPoint): boolean {
    return (
        Number.isFinite(point.latitude) &&
        Number.isFinite(point.longitude) &&
        Math.abs(point.latitude) <= 90 &&
        Math.abs(point.longitude) <= 180
    );
}

/** Coordenada no formato enviado ao backend e exibido nas telas (8 casas decimais). */
export function formatCoordinate(value: number | string): string {
    return Number(value).toFixed(COORDINATE_DIGITS);
}

/**
 * Converte os campos de latitude/longitude do formulário no ponto do mapa. Cada coordenada
 * inválida ou vazia usa a do `fallback`, para o mapa continuar posicionado durante a digitação.
 */
export function pointFromInputs(
    latitude: string,
    longitude: string,
    fallback: GeoPoint = GEO_MAP_DEFAULT_CENTER,
): GeoPoint {
    const parsedLatitude = Number.parseFloat(latitude);
    const parsedLongitude = Number.parseFloat(longitude);

    return {
        latitude: Number.isFinite(parsedLatitude) ? parsedLatitude : fallback.latitude,
        longitude: Number.isFinite(parsedLongitude) ? parsedLongitude : fallback.longitude,
    };
}

/** Ponto de um registro salvo; `null` quando alguma coordenada não foi informada. */
export function pointFromRecord(
    latitude: number | string | null | undefined,
    longitude: number | string | null | undefined,
): GeoPoint | null {
    if (
        latitude === null ||
        latitude === undefined ||
        longitude === null ||
        longitude === undefined
    ) {
        return null;
    }

    const point = { latitude: Number(latitude), longitude: Number(longitude) };

    return Number.isFinite(point.latitude) && Number.isFinite(point.longitude) ? point : null;
}

/** Os tooltips do Leaflet recebem HTML; nomes de registros são escapados antes. */
export function escapeTooltipText(value: string): string {
    const replacements: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    };

    return value.replace(/[&<>"']/g, (character) => replacements[character] ?? character);
}
