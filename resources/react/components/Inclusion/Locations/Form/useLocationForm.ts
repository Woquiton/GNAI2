import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import type { GeoPoint } from '@/components/Inclusion/GeoMap/GeoMap.types';
import {
    formatCoordinate,
    GEO_MAP_DEFAULT_CENTER,
    pointFromInputs,
} from '@/components/Inclusion/GeoMap/GeoMap.utils';
import { notify } from '@/components/UI/NotificationToast/notify';
import { locationUrls } from '../Locations.routes';
import type { InstitutionMapData, LocationFormOptions, LocationRecord } from '../Locations.types';
import type { LocationFormData } from './LocationForm.types';

function findInstitution(
    institutions: InstitutionMapData[],
    id: string,
): InstitutionMapData | undefined {
    return institutions.find((institution) => String(institution.id) === id);
}

function initialData(options: LocationFormOptions, location?: LocationRecord): LocationFormData {
    const institutionId = String(options.selectedInstitution?.id ?? location?.institution_id ?? '');
    const institution = findInstitution(options.institutionsData, institutionId);
    // Na edição o ponto salvo prevalece; no cadastro, a sede escolhida posiciona o marcador.
    const point: GeoPoint = location ?? institution ?? GEO_MAP_DEFAULT_CENTER;

    return {
        institution_id: institutionId,
        name: location?.name ?? '',
        type: location?.type ?? '',
        description: location?.description ?? '',
        latitude: String(point.latitude),
        longitude: String(point.longitude),
        is_active: location?.is_active ?? true,
    };
}

/** Aviso exibido ao tentar marcar o mapa antes de escolher a instituição base. */
export function warnInstitutionRequired(): void {
    notify({
        tone: 'warning',
        title: 'Selecione a instituição',
        text: 'Escolha uma instituição base antes de marcar o local no mapa.',
    });
}

/** Estado, mapa vinculado à instituição e envio do cadastro/edição de pontos de referência. */
export function useLocationForm({
    options,
    location,
}: {
    options: LocationFormOptions;
    location?: LocationRecord;
}) {
    const form = useForm<LocationFormData>(initialData(options, location));
    const { formRef, submit } = useFormSubmission(form);
    const [editorFailed, setEditorFailed] = useState(false);
    const errors = form.errors as Record<string, string | undefined>;
    const selectedInstitution =
        findInstitution(options.institutionsData, form.data.institution_id) ?? null;
    const mapPoint = pointFromInputs(form.data.latitude, form.data.longitude);

    /** Trocar a instituição leva o marcador para a sua sede. */
    function changeInstitution(institutionId: string): void {
        const institution = findInstitution(options.institutionsData, institutionId);

        form.setData((current) => ({
            ...current,
            institution_id: institutionId,
            ...(institutionId
                ? {
                      latitude: String(institution?.latitude ?? GEO_MAP_DEFAULT_CENTER.latitude),
                      longitude: String(institution?.longitude ?? GEO_MAP_DEFAULT_CENTER.longitude),
                  }
                : {}),
        }));
    }

    function updatePoint(point: GeoPoint): void {
        if (!form.data.institution_id) {
            warnInstitutionRequired();
            return;
        }

        form.setData((current) => ({
            ...current,
            latitude: formatCoordinate(point.latitude),
            longitude: formatCoordinate(point.longitude),
        }));
    }

    /** Bloqueia o envio quando o editor não carrega, para não perder a descrição. */
    function reportEditorFailure(): void {
        setEditorFailed(true);
        form.setError(
            'description',
            'Não foi possível carregar o editor de descrição. Atualize a página e tente novamente.',
        );
    }

    function save(): void {
        submit({
            url: location ? locationUrls.update(location.id) : locationUrls.store,
            method: location ? 'put' : 'post',
            failureText: 'Não foi possível salvar o ponto de referência. Tente novamente.',
            blocked: !options.canSubmit || editorFailed,
        });
    }

    return {
        form,
        errors,
        formRef,
        editorFailed,
        selectedInstitution,
        mapPoint,
        changeInstitution,
        updatePoint,
        reportEditorFailure,
        save,
    };
}
