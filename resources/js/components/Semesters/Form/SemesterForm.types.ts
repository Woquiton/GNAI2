/** Payload enviado a `SemesterController@store/update` (ver `Application/Data/Semesters`). */
export type SemesterFormData = {
    year: string;
    term: string;
    start_date: string;
    end_date: string;
    is_current: boolean;
};
