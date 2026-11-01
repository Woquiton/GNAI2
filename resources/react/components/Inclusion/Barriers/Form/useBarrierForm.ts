import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import type { GeoPoint } from '@/components/Inclusion/GeoMap/GeoMap.types';
import {
    formatCoordinate,
    GEO_MAP_DEFAULT_CENTER,
    pointFromInputs,
} from '@/components/Inclusion/GeoMap/GeoMap.utils';
import { barrierUrls } from '../Barriers.routes';
import type { BarrierFormOptions, BarrierRecord } from '../Barriers.types';
import type { BarrierEditorField, BarrierFormData } from './BarrierForm.types';

function today(): string {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `${now.getFullYear()}-${month}-${day}`;
}

function initialData(options: BarrierFormOptions, barrier?: BarrierRecord): BarrierFormData {
    const date = today();
    const saved = barrier && barrier.latitude != null && barrier.longitude != null;
    // Sem coordenadas salvas, o marcador começa na sede da instituição selecionada.
    const point = saved
        ? { latitude: barrier.latitude, longitude: barrier.longitude }
        : (options.selectedInstitution ?? GEO_MAP_DEFAULT_CENTER);

    return {
        name: barrier?.name ?? '',
        description: barrier?.description ?? '',
        institution_id: String(options.selectedInstitution?.id ?? barrier?.institution_id ?? ''),
        barrier_category_id: String(barrier?.barrier_category_id ?? ''),
        priority: barrier?.priority ?? 'medium',
        identified_at: barrier?.identified_at?.slice(0, 10) ?? date,
        location_id: String(barrier?.location_id ?? ''),
        location_specific_details: barrier?.location_specific_details ?? '',
        latitude: String(point.latitude),
        longitude: String(point.longitude),
        no_location: false,
        is_anonymous: barrier?.is_anonymous ?? false,
        not_applicable: barrier?.is_anonymous ? false : (barrier?.not_applicable ?? false),
        affected_student_id: String(barrier?.affected_student_id ?? ''),
        affected_professional_id: String(barrier?.affected_professional_id ?? ''),
        affected_person_name: barrier?.affected_person_name ?? '',
        affected_person_role: barrier?.affected_person_role ?? '',
        deficiencies: barrier?.deficiencies?.map(({ id }) => String(id)) ?? [],
        // A situação atual é a da vistoria mais recente.
        status: barrier?.inspections?.[0]?.status ?? 'identified',
        is_active: true,
        inspection: {
            date,
            type: barrier ? 'periodic' : 'initial',
            description: '',
            evidences: [],
        },
    };
}

const editorLabels: Record<BarrierEditorField, string> = {
    description: 'descrição',
    location_specific_details: 'complemento',
};

/**
 * Estado, mapa vinculado à instituição e envio do relato/edição de barreiras com a vistoria.
 * A instituição e o ponto de referência reposicionam o marcador; categorias que não se aplicam ao
 * mapa bloqueiam a marcação.
 */
export function useBarrierForm({
    options,
    barrier,
}: {
    options: BarrierFormOptions;
    barrier?: BarrierRecord;
}) {
    const form = useForm<BarrierFormData>(initialData(options, barrier));
    const { formRef, submit } = useFormSubmission(form);
    const [editorFailed, setEditorFailed] = useState(false);
    const [showLocations, setShowLocations] = useState(true);
    const errors = form.errors as Record<string, string | undefined>;
    const institution =
        options.institutions.find(({ id }) => id === Number(form.data.institution_id)) ?? null;
    const category = options.categories.find(
        ({ id }) => id === Number(form.data.barrier_category_id),
    );
    const mapBlocked = category?.blocks_map ?? false;
    const mapPoint = pointFromInputs(form.data.latitude, form.data.longitude);

    /** Trocar a instituição limpa o ponto de referência e leva o marcador à sede. */
    function changeInstitution(institutionId: string): void {
        const next = options.institutions.find(({ id }) => id === Number(institutionId));

        setShowLocations(true);
        form.setData((current) => ({
            ...current,
            institution_id: institutionId,
            location_id: '',
            latitude: String(next?.latitude ?? GEO_MAP_DEFAULT_CENTER.latitude),
            longitude: String(next?.longitude ?? GEO_MAP_DEFAULT_CENTER.longitude),
        }));
    }

    /** O ponto de referência escolhido posiciona o marcador. */
    function changeLocation(locationId: string): void {
        const selected = institution?.locations.find(({ id }) => String(id) === locationId);

        form.setData((current) => ({
            ...current,
            location_id: locationId,
            ...(selected
                ? { latitude: String(selected.latitude), longitude: String(selected.longitude) }
                : {}),
        }));
    }

    function updatePoint(point: GeoPoint): void {
        form.setData((current) => ({
            ...current,
            latitude: formatCoordinate(point.latitude),
            longitude: formatCoordinate(point.longitude),
        }));
    }

    /** Bloqueia o envio quando um editor rico não carrega, para não perder o conteúdo. */
    function reportEditorFailure(field: BarrierEditorField): void {
        setEditorFailed(true);
        form.setError(
            field,
            `Não foi possível carregar o editor de ${editorLabels[field]}. Atualize a página e tente novamente.`,
        );
    }

    function save(): void {
        submit({
            url: barrier ? barrierUrls.update(barrier.id) : barrierUrls.store,
            method: barrier ? 'put' : 'post',
            // Com evidências, a edição segue como POST multipart com `_method=put`.
            files: form.data.inspection.evidences.length > 0,
            failureText: 'Não foi possível salvar a barreira. Tente novamente.',
            blocked: !options.canSubmit || editorFailed,
        });
    }

    return {
        form,
        errors,
        formRef,
        editorFailed,
        institution,
        category,
        mapBlocked,
        mapPoint,
        showLocations,
        setShowLocations,
        changeInstitution,
        changeLocation,
        updatePoint,
        reportEditorFailure,
        save,
    };
}
