import type { InertiaFormProps } from '@inertiajs/react';

/**
 * Payload enviado a `GuardianController@store/update` (ver `Application/Data/Guardians`).
 * `remove_photo` existe somente na edição.
 */
export type GuardianFormData = {
    name: string;
    document: string;
    birth_date: string;
    gender: string;
    email: string;
    phone: string;
    relationship: string;
    address: string;
    photo: File | null;
    remove_photo?: boolean;
};

export type GuardianFormMode = 'create' | 'edit';

/** Estado compartilhado pelas seções do formulário. */
export interface GuardianFormSectionProps {
    form: InertiaFormProps<GuardianFormData>;
    errors: Partial<Record<keyof GuardianFormData, string>>;
    disabled: boolean;
}
