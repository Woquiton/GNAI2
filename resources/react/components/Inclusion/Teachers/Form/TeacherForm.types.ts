import type { InertiaFormProps } from '@inertiajs/react';

/** Estado do formulário; o payload de cada operação é montado em `useTeacherForm`. */
export type TeacherFormData = {
    name: string;
    document: string;
    birth_date: string;
    gender: string;
    email: string;
    phone: string;
    address: string;
    registration: string;
    photo: File | null;
    remove_photo: boolean;
    password: string;
    password_confirmation: string;
};

export type TeacherFormMode = 'create' | 'edit';

/** Estado compartilhado pelas seções do formulário. */
export interface TeacherFormSectionProps {
    form: InertiaFormProps<TeacherFormData>;
    errors: Record<string, string | undefined>;
    disabled: boolean;
}
