/** Payload enviado a `PendencyController@store/update` (ver `Application/Data/Pendencies`). */
export type PendencyFormData = {
    title: string;
    description: string;
    assigned_to: string;
    priority: string;
    due_date: string;
};
