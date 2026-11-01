export interface PeiShowRecord {
    id: number;
    version: number | null;
    is_finished: boolean;
    created_at: string | null;
    course_name: string | null;
    semester_label: string | null;
    responsible: string;
}

export interface PeiShowStudent {
    id: number;
    name: string;
    registration: string | null;
    photo_url: string | null;
    status_label: string | null;
    status_color: string | null;
    deficiencies: string[];
}

export interface PeiPaeeSummary {
    id: number;
    version: number | null;
    status_label: string;
    attendance_frequency_per_week: number | null;
    attendance_duration_minutes: number | null;
    attendance_format_label: string;
    attendance_location_label: string;
    common_teachers_articulation_html: string;
}

export interface PeiAttendanceActivity {
    id: string;
    date: string | null;
    professional: string | null;
    text_html: string;
}

export interface PeiAttendanceMonitoring {
    id: string;
    date: string | null;
    source: string;
    text_html: string;
    indicators_html: string | null;
    adjustments_html: string | null;
}

export interface PeiAttendanceReturn {
    id: string;
    date: string | null;
    source: string;
    professional: string | null;
    guardians: string | null;
    summary_html: string;
}

export interface PeiAttendanceSummary {
    activities: PeiAttendanceActivity[];
    monitoring: PeiAttendanceMonitoring[];
    returns: PeiAttendanceReturn[];
}

export interface PeiDisciplineSummary {
    id: number;
    discipline_name: string | null;
    teacher_name: string | null;
    created_at: string | null;
    can_update: boolean;
    can_delete: boolean;
}

export interface PeiShowPermissions {
    viewPaee: boolean;
    viewDisciplines: boolean;
    createDiscipline: boolean;
    finish: boolean;
    delete: boolean;
    updateOtherInfo: boolean;
    pdf: boolean;
}

export interface PeiShowProps {
    pei: PeiShowRecord;
    student: PeiShowStudent;
    paee: PeiPaeeSummary | null;
    attendanceSummary: PeiAttendanceSummary;
    otherRelevantInfo: string | null;
    peiDisciplines: PeiDisciplineSummary[] | null;
    activeTab?: string;
    can: PeiShowPermissions;
}

export interface PeiDisciplineDetails {
    id: number;
    discipline_name: string | null;
    teacher_name: string | null;
    specific_objectives_html: string;
    objectives_deadline_html: string;
    content_programmatic_html: string;
    curricular_reference_html: string;
    methodologies_html: string;
    materials_and_assistive_technology_html: string;
    evaluations_html: string;
    complementary_records_html: string;
    opinion_html: string;
}

export interface PeiDisciplineShowProps {
    pei: {
        id: number;
        version: number | null;
        is_finished: boolean;
    };
    student: {
        id: number;
        name: string;
    };
    peiDiscipline: PeiDisciplineDetails;
    revisions: PeiDisciplineRevision[];
    can: {
        update: boolean;
        delete: boolean;
        addRevision: boolean;
        pdf: boolean;
    };
}

export interface PeiDisciplineRevision {
    id: number;
    reviewed_at: string | null;
    reviewer_name: string | null;
    what_changed: string;
    why: string;
}
