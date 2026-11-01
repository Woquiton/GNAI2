export interface PaeeOption {
    value: string;
    label: string;
}

export interface PaeeStudentSummary {
    id: number;
    name: string;
}

export interface PaeeListRecord {
    id: number;
    version: number | null;
    is_current: boolean;
    status: string | null;
    status_label: string;
    semester_label: string | null;
    next_review_date: string | null;
    student: PaeeStudentSummary | null;
}

export interface PaeePaginator {
    data: PaeeListRecord[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
}

export type PaeeListFilters = {
    status: string;
    semester_id: string;
    search: string;
};

export interface PaeeListPermissions {
    view: boolean;
    update: boolean;
    delete: boolean;
}

export interface PaeeListProps {
    paees: PaeePaginator;
    student: PaeeStudentSummary | null;
    semesters: PaeeOption[];
    filters: Partial<PaeeListFilters>;
    can: PaeeListPermissions;
}

export interface PaeeHistoryProps {
    student: PaeeStudentSummary;
    paees: PaeeListRecord[];
    can: PaeeListPermissions;
}

export interface PaeeObjectiveInput {
    description: string;
    term: string;
    linked_barrier_id: number | null;
}

export interface PaeeResourceInput {
    description: string;
    acquisition_type: string;
    assistive_technology_id: number | null;
}

/** Campos enviados no cadastro e na edição (mesmos nomes do Blade de origem). */
export interface PaeeFormData {
    attendance_frequency_per_week: string;
    attendance_duration_minutes: string;
    attendance_format: string;
    attendance_location: string;
    assistive_technology_needed: boolean;
    assistive_technology_notes: string;
    assistive_technology_availability_capacity: string;
    caa_needed: boolean;
    caa_notes: string;
    is_assistive_technology_portable_digital_device: boolean;
    assistive_technology_pedagogical_opinion: string;
    support_professional_needed: boolean;
    support_professional_justification: string;
    libras_interpreter_needed: boolean;
    libras_interpreter_justification: string;
    guide_interpreter_needed: boolean;
    guide_interpreter_justification: string;
    school_professionals_orientation: string;
    common_teachers_articulation: string;
    family_articulation: string;
    intersectoral_articulation: string;
    training_demands: string;
    objectives: PaeeObjectiveInput[];
    resources: PaeeResourceInput[];
}

export interface PaeeEditRecord {
    id: number;
    version: number | null;
    attendance_frequency_per_week: number | null;
    attendance_duration_minutes: number | null;
    attendance_format: string | null;
    attendance_location: string | null;
    assistive_technology_needed: boolean;
    assistive_technology_notes: string | null;
    assistive_technology_availability_capacity: string | null;
    caa_needed: boolean;
    caa_notes: string | null;
    is_assistive_technology_portable_digital_device: boolean;
    assistive_technology_pedagogical_opinion: string | null;
    support_professional_needed: boolean;
    support_professional_justification: string | null;
    libras_interpreter_needed: boolean;
    libras_interpreter_justification: string | null;
    guide_interpreter_needed: boolean;
    guide_interpreter_justification: string | null;
    school_professionals_orientation: string | null;
    common_teachers_articulation: string | null;
    family_articulation: string | null;
    intersectoral_articulation: string | null;
    training_demands: string | null;
    objectives: Array<{
        description: string;
        term: string;
        linked_barrier_id: number | null;
    }>;
    resources: Array<{
        description: string;
        acquisition_type: string;
        assistive_technology_id: number | null;
    }>;
}

export interface PaeeCreateProps {
    caseStudy: {
        id: number;
        version: number | null;
    };
    student: PaeeStudentSummary;
}

export interface PaeeEditProps {
    paee: PaeeEditRecord;
    student: PaeeStudentSummary;
}

export interface PaeeShowRecord {
    id: number;
    version: number | null;
    is_current: boolean;
    status: string | null;
    status_label: string;
    semester_label: string | null;
    creator_name: string | null;
    created_at: string | null;
    next_review_date: string | null;
    case_study: {
        id: number;
        version: number | null;
    } | null;
    attendance_frequency_per_week: number | null;
    attendance_duration_minutes: number | null;
    attendance_format_label: string;
    attendance_location_label: string;
    assistive_technology_needed: boolean;
    assistive_technology_notes: string | null;
    assistive_technology_availability_capacity: string | null;
    caa_needed: boolean;
    caa_notes: string | null;
    is_assistive_technology_portable_digital_device: boolean;
    assistive_technology_pedagogical_opinion: string | null;
    support_professional_needed: boolean;
    support_professional_justification: string | null;
    libras_interpreter_needed: boolean;
    libras_interpreter_justification: string | null;
    guide_interpreter_needed: boolean;
    guide_interpreter_justification: string | null;
    school_professionals_orientation: string | null;
    common_teachers_articulation: string | null;
    family_articulation: string | null;
    intersectoral_articulation: string | null;
    training_demands: string | null;
    objectives: Array<{
        id: number;
        description: string;
        term_label: string;
        linked_barrier: {
            type_label: string;
            observed_situation: string | null;
        } | null;
    }>;
    resources: Array<{
        id: number;
        description: string;
        acquisition_type_label: string;
        assistive_technology_name: string | null;
    }>;
    reviews: Array<{
        id: number;
        reviewed_at: string | null;
        reviewer_name: string | null;
        what_changed: string;
        why: string;
    }>;
}

export interface PaeeShowProps {
    paee: PaeeShowRecord;
    student: PaeeStudentSummary;
    can: {
        update: boolean;
        delete: boolean;
        viewCaseStudy: boolean;
    };
}
