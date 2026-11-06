export interface TeacherPortalAssignment {
    id: number;
    student_id: number;
    student_name: string;
    discipline_name: string | null;
    course_name: string | null;
}

export interface TeacherPortalIndexProps {
    assignments: TeacherPortalAssignment[];
}

export interface TeacherPortalCaseStudy {
    version: number;
    status_label: string;
    semester_label: string | null;
    demand_origin_label: string;
    student_observation: string | null;
    student_family_listening: string | null;
    teachers_listening: string | null;
    favorable_aspects: string | null;
    potentials_interests: string | null;
    other_info: string | null;
    barriers: Array<{
        id: number;
        type_label: string;
        observed_situation: string | null;
        participation_implication: string | null;
    }>;
    strategies: Array<{
        id: number;
        description: string | null;
        linked_barrier_label: string | null;
    }>;
    contributions: Array<{
        id: number;
        author_name: string | null;
        role: string | null;
        created_at: string | null;
        content: string | null;
    }>;
}

export interface TeacherPortalPaee {
    version: number;
    status_label: string;
    attendance_frequency_per_week: number | null;
    attendance_duration_minutes: number | null;
    attendance_format_label: string;
    attendance_location_label: string;
    assistive_technology_needed: boolean;
    support_professional_needed: boolean;
    assistive_technology_notes: string | null;
    school_professionals_orientation: string | null;
    common_teachers_articulation: string | null;
    family_articulation: string | null;
    objectives: Array<{ id: number; description: string | null; term_label: string }>;
    resources: Array<{ id: number; description: string | null; acquisition_type_label: string }>;
    reviews: Array<{
        id: number;
        reviewed_at: string | null;
        reviewer_name: string | null;
        what_changed: string | null;
        why: string | null;
    }>;
}

export interface TeacherPortalPeiDiscipline {
    id: number;
    discipline_name: string | null;
    teacher_name: string | null;
    specific_objectives_html: string;
    content_programmatic_html: string;
    methodologies_html: string;
    evaluations_html: string;
    opinion_html: string | null;
    can_edit: boolean;
}

export interface TeacherPortalStudent {
    id: number;
    name: string;
    registration: string | null;
    photo_url: string | null;
}

export interface TeacherPortalStudentStatus {
    has_laudo: boolean;
    has_case_study: boolean;
    has_paee: boolean;
    has_pei: boolean;
}

export interface TeacherPortalDocument {
    id: number;
    type_label: string | null;
    title: string | null;
    created_at: string | null;
}

export interface TeacherPortalPei {
    version: number;
    is_finished: boolean;
    disciplines: TeacherPortalPeiDiscipline[];
}

export interface TeacherPortalStudentShowProps {
    student: TeacherPortalStudent;
    status: TeacherPortalStudentStatus;
    documents: TeacherPortalDocument[];
    caseStudy: TeacherPortalCaseStudy | null;
    paee: TeacherPortalPaee | null;
    pei: TeacherPortalPei | null;
}

export interface TeacherPortalDisciplineRecord {
    id: number;
    discipline_name: string | null;
    student_id: number;
    student_name: string;
    specific_objectives: string | null;
    objectives_deadline: string | null;
    content_programmatic: string | null;
    curricular_reference: string | null;
    methodologies: string | null;
    materials_and_assistive_technology: string | null;
    evaluations: string | null;
    opinion: string | null;
    complementary_records: string | null;
}

export interface TeacherPortalDisciplineEditProps {
    peiDiscipline: TeacherPortalDisciplineRecord;
}
