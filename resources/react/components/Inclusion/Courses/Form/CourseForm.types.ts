/**
 * Payload enviado a `CourseController@store/update` (ver `Application/Data/Courses`).
 * `is_active` só existe na edição; o cadastro não envia o campo.
 */
export type CourseFormData = {
    name: string;
    description: string;
    discipline_ids: number[];
    is_active?: string;
};
