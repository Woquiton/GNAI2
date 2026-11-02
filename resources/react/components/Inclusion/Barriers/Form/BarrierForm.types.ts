import type { InertiaFormProps } from '@inertiajs/react';

/** Payload enviado a `BarrierController@store/update` (ver `Application/Data/Barriers`). */
export type BarrierFormData = {
    name: string;
    description: string;
    institution_id: string;
    barrier_category_id: string;
    priority: string;
    identified_at: string;
    location_id: string;
    location_specific_details: string;
    latitude: string;
    longitude: string;
    no_location: boolean;
    is_anonymous: boolean;
    not_applicable: boolean;
    affected_student_id: string;
    affected_professional_id: string;
    affected_person_name: string;
    affected_person_role: string;
    deficiencies: string[];
    status: string;
    is_active: boolean;
    inspection: { date: string; type: string; description: string; evidences: File[] };
};

/** Editores ricos cuja falha de carregamento bloqueia o envio. */
export type BarrierEditorField =
    | 'description'
    | 'location_specific_details'
    | 'inspection.description';

/** Estado compartilhado pelas seções do formulário. */
export interface BarrierFormSectionProps {
    form: InertiaFormProps<BarrierFormData>;
    errors: Record<string, string | undefined>;
    disabled: boolean;
}
