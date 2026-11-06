/** Payload enviado a `WaitlistController@store` (ver `Application/Data/Waitlists`). */
export type WaitlistCreateFormData = {
    item_type: string;
    waitlistable_id: string;
    student_id: string;
    professional_id: string;
    observation: string;
};

/** Payload enviado a `WaitlistController@update`: a identificação fica bloqueada na edição. */
export type WaitlistEditFormData = {
    observation: string;
};
