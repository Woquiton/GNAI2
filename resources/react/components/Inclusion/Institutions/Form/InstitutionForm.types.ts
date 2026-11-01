import type { InertiaFormProps } from '@inertiajs/react';

/** Payload enviado a `InstitutionController@store/update` (ver `Application/Data/Institutions`). */
export type InstitutionFormData = {
    name: string;
    short_name: string;
    city: string;
    state: string;
    district: string;
    address: string;
    is_active: boolean;
    default_zoom: string;
    latitude: string;
    longitude: string;
};

/** Campos do endereço usados na busca e preenchidos pela geocodificação reversa. */
export type InstitutionAddress = Pick<
    InstitutionFormData,
    'address' | 'district' | 'city' | 'state'
>;

/** Estado compartilhado pelas seções do formulário. */
export interface InstitutionFormSectionProps {
    form: InertiaFormProps<InstitutionFormData>;
    errors: Record<string, string | undefined>;
    disabled: boolean;
}
