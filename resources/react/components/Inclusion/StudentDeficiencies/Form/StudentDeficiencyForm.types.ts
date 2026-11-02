/** Payload enviado a `StudentDeficiencyController@store/update`. */
export type StudentDeficiencyFormData = {
    deficiency_id: string;
    severity: string;
    notes: string;
};

export type StudentDeficiencyFormMode = 'create' | 'edit';
