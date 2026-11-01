import { useForm } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import type { GeoPoint } from '@/components/Inclusion/GeoMap/GeoMap.types';
import {
    formatCoordinate,
    GEO_MAP_DEFAULT_CENTER,
    pointFromInputs,
} from '@/components/Inclusion/GeoMap/GeoMap.utils';
import { DEFAULT_INSTITUTION_ZOOM } from '../Institutions.constants';
import { institutionUrls } from '../Institutions.routes';
import type { InstitutionRecord } from '../Institutions.types';
import {
    addressKey,
    hasSearchableAddress,
    reverseGeocode,
    searchAddress,
} from './institutionGeocoding';
import type { InstitutionAddress, InstitutionFormData } from './InstitutionForm.types';

/** Atraso da busca do endereço digitado e tempo máximo de espera da resposta. */
const SEARCH_DELAY = 500;
const SEARCH_TIMEOUT = 10000;

function initialData(institution?: InstitutionRecord): InstitutionFormData {
    const point = institution
        ? { latitude: Number(institution.latitude), longitude: Number(institution.longitude) }
        : GEO_MAP_DEFAULT_CENTER;

    return {
        name: institution?.name ?? '',
        short_name: institution?.short_name ?? '',
        city: institution?.city ?? '',
        state: institution?.state ?? '',
        district: institution?.district ?? '',
        address: institution?.address ?? '',
        is_active: institution?.is_active ?? true,
        default_zoom: String(institution?.default_zoom ?? DEFAULT_INSTITUTION_ZOOM),
        latitude: String(point.latitude),
        longitude: String(point.longitude),
    };
}

/**
 * Estado, envio e geocodificação do cadastro/edição de instituições: o endereço digitado
 * reposiciona a sede e o ponto marcado no mapa preenche o endereço.
 */
export function useInstitutionForm({
    institution,
    canSubmit,
}: {
    institution?: InstitutionRecord;
    canSubmit: boolean;
}) {
    const form = useForm<InstitutionFormData>(initialData(institution));
    const { formRef, submit } = useFormSubmission(form);
    const errors = form.errors as Record<string, string | undefined>;
    const geocodingRequest = useRef<AbortController | null>(null);
    const setDataRef = useRef(form.setData);
    setDataRef.current = form.setData;

    const { address, district, city, state } = form.data;
    const previousAddressRef = useRef(addressKey({ address, district, city, state }));
    const mapPoint = pointFromInputs(form.data.latitude, form.data.longitude);
    const parsedZoom = Number.parseInt(form.data.default_zoom, 10);
    const zoom = Number.isFinite(parsedZoom) ? parsedZoom : DEFAULT_INSTITUTION_ZOOM;

    // Endereço digitado: posiciona a sede e ajusta o zoom conforme o nível de detalhe.
    useEffect(() => {
        const typed: InstitutionAddress = { address, district, city, state };
        const key = addressKey(typed);

        if (previousAddressRef.current === key) return;
        previousAddressRef.current = key;
        if (!hasSearchableAddress(typed)) return;

        const controller = new AbortController();
        geocodingRequest.current?.abort();
        geocodingRequest.current = controller;
        const timer = window.setTimeout(() => {
            const timeout = window.setTimeout(() => controller.abort(), SEARCH_TIMEOUT);

            searchAddress(typed, controller.signal)
                .then((match) => {
                    if (!match) return;
                    setDataRef.current((current) => ({
                        ...current,
                        latitude: formatCoordinate(match.latitude),
                        longitude: formatCoordinate(match.longitude),
                        default_zoom: String(match.zoom),
                    }));
                })
                .catch(() => undefined)
                .finally(() => window.clearTimeout(timeout));
        }, SEARCH_DELAY);

        return () => {
            window.clearTimeout(timer);
            controller.abort();
        };
    }, [address, district, city, state]);

    useEffect(() => () => geocodingRequest.current?.abort(), []);

    /** Ponto marcado no mapa: grava as coordenadas e preenche o endereço encontrado. */
    function updateFromMap(point: GeoPoint): void {
        form.setData((current) => ({
            ...current,
            latitude: formatCoordinate(point.latitude),
            longitude: formatCoordinate(point.longitude),
        }));

        const controller = new AbortController();
        geocodingRequest.current?.abort();
        geocodingRequest.current = controller;
        reverseGeocode(point, { address, district, city, state }, controller.signal)
            .then((found) => {
                if (!found) return;
                // Evita que o endereço preenchido pelo mapa dispare uma nova busca.
                previousAddressRef.current = addressKey(found);
                setDataRef.current((current) => ({ ...current, ...found }));
            })
            .catch(() => undefined);
    }

    function updateZoom(nextZoom: number): void {
        form.setData('default_zoom', String(nextZoom));
    }

    function save(): void {
        submit({
            url: institution ? institutionUrls.update(institution.id) : institutionUrls.store,
            method: institution ? 'put' : 'post',
            failureText: 'Não foi possível salvar a instituição. Tente novamente.',
            blocked: !canSubmit,
        });
    }

    return { form, errors, formRef, mapPoint, zoom, updateFromMap, updateZoom, save };
}
