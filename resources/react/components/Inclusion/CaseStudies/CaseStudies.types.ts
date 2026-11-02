import type { SelectFieldOption } from '@/components/Forms/SelectField/SelectField.types';

export interface CaseStudyStudent {
    id: number;
    name: string;
    registration?: string | null;
    photo_url?: string | null;
}

export interface CaseStudyRow {
    id: number;
    version: number;
    status: string;
    status_label: string;
    status_tone: string;
    semester_label: string | null;
    created_at: string | null;
    paees_count: number | null;
    student: { id: number; name: string } | null;
}

export interface CaseStudyPaginator {
    data: CaseStudyRow[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
}

export type CaseStudyListFilters = {
    search: string;
    status: string;
    semester_id: string;
};

export interface CaseStudyListPermissions {
    create: boolean;
    view: boolean;
    update: boolean;
    delete: boolean;
}

export interface CaseStudyListProps {
    caseStudies: CaseStudyPaginator;
    student: CaseStudyStudent | null;
    semesters: SelectFieldOption[];
    statuses: SelectFieldOption[];
    filters: Partial<CaseStudyListFilters>;
    can: CaseStudyListPermissions;
}

/** Props da listagem aberta a partir do prontuário do aluno (`Inclusion/CaseStudies/Index`). */
export interface CaseStudyStudentListProps extends Omit<CaseStudyListProps, 'student'> {
    student: CaseStudyStudent;
}

export interface CaseStudyBarrierInput {
    type: string;
    observed_situation: string;
    participation_implication: string;
}

export interface CaseStudyStrategyInput {
    description: string;
}

export interface CaseStudyFormRecord {
    id: number;
    version: number;
    demand_origin: string;
    participants_summary: string | null;
    study_date: string | null;
    student_observation: string | null;
    student_family_listening: string | null;
    teachers_listening: string | null;
    other_info: string | null;
    care_network_notes: string | null;
    favorable_aspects: string | null;
    potentials_interests: string | null;
    needed_supports: string[];
    needed_supports_justification: string | null;
    acceptance_status: string;
    acceptance_date: string | null;
    barriers: CaseStudyBarrierInput[];
    strategies: CaseStudyStrategyInput[];
}

export interface CaseStudyFormOptions {
    demandOrigins: SelectFieldOption[];
    neededSupports: SelectFieldOption[];
    barrierTypes: SelectFieldOption[];
    acceptanceStatuses: SelectFieldOption[];
}

export interface CaseStudyFormProps {
    student: CaseStudyStudent;
    caseStudy: CaseStudyFormRecord | null;
    options: CaseStudyFormOptions;
}

export interface CaseStudyDetail extends CaseStudyRow {
    is_current: boolean;
    creator_name: string | null;
    demand_origin_label: string;
    participants_summary: string | null;
    study_date: string | null;
    student_observation: string | null;
    student_family_listening: string | null;
    teachers_listening: string | null;
    other_info: string | null;
    care_network_notes: string | null;
    favorable_aspects: string | null;
    potentials_interests: string | null;
    needed_supports_label: string;
    needed_supports_justification: string | null;
    acceptance_status_label: string;
    acceptance_date: string | null;
    completed_at: string | null;
    barriers: Array<{
        id: number;
        type_label: string;
        observed_situation: string;
        participation_implication: string;
    }>;
    strategies: Array<{
        id: number;
        description: string;
        linked_barrier_label: string | null;
    }>;
    contributions: Array<{
        id: number;
        author_id: number | null;
        author_name: string | null;
        author_photo_url: string | null;
        role: string;
        content: string;
        created_at: string | null;
    }>;
}

export interface CaseStudyShowPermissions {
    update: boolean;
    complete: boolean;
    contribute: boolean;
    delete: boolean;
    createPaee: boolean;
    pdf: boolean;
}

export interface CaseStudyShowProps {
    student: CaseStudyStudent;
    caseStudy: CaseStudyDetail;
    can: CaseStudyShowPermissions;
}

export interface CaseStudyHistoryProps {
    student: CaseStudyStudent;
    caseStudies: CaseStudyRow[];
    can: CaseStudyListPermissions;
}
