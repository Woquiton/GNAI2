import type { InertiaFormProps } from '@inertiajs/react';

/** Estado do formulário; o payload de cada operação é montado em `useProfessionalForm`. */
export type ProfessionalFormData = {
    name: string;
    document: string;
    birth_date: string;
    gender: string;
    email: string;
    phone: string;
    address: string;
    position_id: string;
    registration: string;
    entry_date: string;
    status: string;
    is_admin: boolean;
    show_on_website: boolean;
    photo: File | null;
    remove_photo: boolean;
    password: string;
    password_confirmation: string;
};

export type ProfessionalFormMode = 'create' | 'edit';

/** Estado compartilhado pelas seções do formulário. */
export interface ProfessionalFormSectionProps {
    form: InertiaFormProps<ProfessionalFormData>;
    errors: Record<string, string | undefined>;
    disabled: boolean;
}
