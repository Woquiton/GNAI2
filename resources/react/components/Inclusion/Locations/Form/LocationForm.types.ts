import type { InertiaFormProps } from '@inertiajs/react';

/** Payload enviado a `LocationController@store/update` (ver `Application/Data/Locations`). */
export type LocationFormData = {
    institution_id: string;
    name: string;
    type: string;
    description: string;
    latitude: string;
    longitude: string;
    is_active: boolean;
};

/** Estado compartilhado pelas seções do formulário. */
export interface LocationFormSectionProps {
    form: InertiaFormProps<LocationFormData>;
    errors: Record<string, string | undefined>;
    disabled: boolean;
}
