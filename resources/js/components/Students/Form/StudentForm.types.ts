import type { InertiaFormProps } from '@inertiajs/react';

/**
 * Payload enviado a `StudentController@store/update` (ver `Application/Data/Students`).
 * `status` é enviado no cadastro e na edição; `remove_photo` existe somente na edição.
 */
export type StudentFormData = {
    name: string;
    document: string;
    birth_date: string;
    gender: string;
    email: string;
    phone: string;
    address: string;
    registration: string;
    entry_date: string;
    follow_up_type: string;
    photo: File | null;
    status: string;
    remove_photo?: boolean;
};

export type StudentFormMode = 'create' | 'edit';

/** Estado compartilhado pelas seções do formulário. */
export interface StudentFormSectionProps {
    form: InertiaFormProps<StudentFormData>;
    errors: Partial<Record<keyof StudentFormData, string>>;
    disabled: boolean;
}
