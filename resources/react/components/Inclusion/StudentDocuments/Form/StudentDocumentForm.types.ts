import type { InertiaFormProps } from '@inertiajs/react';

/** Payload enviado a `StudentDocumentController@store/update` (ver `Application/Data/StudentDocuments`). */
export type StudentDocumentFormData = {
    title: string;
    type: string;
    file: File | null;
};

/** Estado compartilhado pelas seções do formulário. */
export interface StudentDocumentFormSectionProps {
    form: InertiaFormProps<StudentDocumentFormData>;
    errors: Partial<Record<keyof StudentDocumentFormData, string>>;
    disabled: boolean;
    editing: boolean;
}
