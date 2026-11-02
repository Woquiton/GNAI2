import type { InertiaFormProps } from '@inertiajs/react';

/** Estado do formulário; o payload enviado é montado em `useStudentCourseForm`. */
export type StudentCourseFormData = {
    course_id: string;
    academic_year: string;
    semester_id: string;
    is_current: boolean;
    school_attendance_status: string;
    failed_discipline_ids: number[];
    at_risk_discipline_ids: number[];
};

export type StudentCourseFormMode = 'create' | 'edit';

export type DisciplineGroupName = 'failed_discipline_ids' | 'at_risk_discipline_ids';

/** Estado compartilhado pelas seções do formulário. */
export interface StudentCourseFormSectionProps {
    form: InertiaFormProps<StudentCourseFormData>;
    errors: Record<string, string | undefined>;
    disabled: boolean;
}
