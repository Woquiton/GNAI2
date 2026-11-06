import type { GeoPoint } from '@/components/GeoMap/GeoMap.types';
import type { InstitutionAddress } from './InstitutionForm.types';

/**
 * Geocodificação da sede pelo Nominatim (OpenStreetMap): o endereço digitado posiciona o mapa e
 * o ponto escolhido no mapa preenche o endereço. Falhas são silenciosas, como no cadastro legado;
 * o usuário continua podendo informar as coordenadas manualmente.
 */
const NOMINATIM = 'https://nominatim.openstreetmap.org';

type NominatimAddress = Record<string, string | undefined>;

interface NominatimSearchResult {
    lat: string;
    lon: string;
    address?: NominatimAddress;
}

export interface AddressMatch extends GeoPoint {
    zoom: number;
}

function trimmedAddress(address: InstitutionAddress): InstitutionAddress {
    return {
        address: address.address.trim(),
        district: address.district.trim(),
        city: address.city.trim(),
        state: address.state.trim(),
    };
}

/** A busca só é feita quando algum campo tem conteúdo suficiente para um resultado útil. */
export function hasSearchableAddress(address: InstitutionAddress): boolean {
    const { address: street, district, city, state } = trimmedAddress(address);

    return city.length >= 2 || street.length >= 3 || district.length >= 3 || state.length >= 2;
}

/** Quanto mais específico o endereço informado, mais próximo o zoom aplicado. */
function zoomForAddress({ address, district, city, state }: InstitutionAddress): number {
    if (address) return 18;
    if (district) return 16;
    if (city) return 14;
    if (state) return 6;
    return 12;
}

function foundCity(address: NominatimAddress | undefined): string {
    return address?.city || address?.town || address?.municipality || address?.village || '';
}

/** Descarta resultados em outra cidade quando a cidade foi informada. */
function matchesCity(result: NominatimSearchResult, city: string): boolean {
    const found = foundCity(result.address).toLowerCase();
    const searched = city.toLowerCase();

    return !city || !found || found.includes(searched) || searched.includes(found);
}

export async function searchAddress(
    address: InstitutionAddress,
    signal: AbortSignal,
): Promise<AddressMatch | null> {
    const trimmed = trimmedAddress(address);
    const query = [trimmed.address, trimmed.district, trimmed.city, trimmed.state]
        .filter(Boolean)
        .concat('Brasil')
        .join(', ');
    const response = await fetch(
        `${NOMINATIM}/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=1&accept-language=pt-BR`,
        { signal },
    );
    const results: NominatimSearchResult[] = response.ok ? await response.json() : [];
    const [first] = results;

    if (!first || !matchesCity(first, trimmed.city)) {
        return null;
    }

    return {
        latitude: Number(first.lat),
        longitude: Number(first.lon),
        zoom: zoomForAddress(trimmed),
    };
}

/** Endereço do ponto escolhido; campos não encontrados mantêm o valor atual do formulário. */
export async function reverseGeocode(
    point: GeoPoint,
    current: InstitutionAddress,
    signal: AbortSignal,
): Promise<InstitutionAddress | null> {
    const response = await fetch(
        `${NOMINATIM}/reverse?format=json&lat=${point.latitude}&lon=${point.longitude}&addressdetails=1&zoom=18&accept-language=pt-BR`,
        { signal },
    );
    const result: { address?: NominatimAddress } | null = response.ok
        ? await response.json()
        : null;
    const found = result?.address;

    if (!found) {
        return null;
    }

    return {
        address: found.road || found.pedestrian || found.path || current.address,
        district:
            found.hamlet ||
            found.suburb ||
            found.neighbourhood ||
            found.city_district ||
            found.village ||
            current.district,
        city: foundCity(found) || current.city,
        state: found.state || current.state,
    };
}

export function addressKey({ address, district, city, state }: InstitutionAddress): string {
    return [address, district, city, state].join('|');
}
