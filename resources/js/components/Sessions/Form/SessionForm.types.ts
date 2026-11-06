import type { InertiaFormProps } from '@inertiajs/react';
import type { SessionCreateProps, SessionEditProps } from '../Sessions.types';

export type SessionFormProps =
    ({ mode: 'create' } & SessionCreateProps) | ({ mode: 'edit' } & SessionEditProps);

/** Campos enviados a `Create/UpdateSessionData`. */
export type SessionFormData = {
    attendance_type: string;
    type: string;
    professional_id: string;
    student_ids: string[];
    session_date: string;
    start_time: string;
    end_time: string;
    location: string;
    session_objective: string;
};

/** Estado compartilhado pelas seções do formulário. */
export interface SessionFormSectionProps {
    form: InertiaFormProps<SessionFormData>;
    errors: Record<string, string | undefined>;
    disabled: boolean;
}
