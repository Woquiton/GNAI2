import type { TableListPage } from '@/components/Tables/TableList/TableList';

/** Disciplina ativa oferecida na matriz curricular. */
export interface CourseDisciplineOption {
    id: number;
    name: string;
}

/** Registro usado na edição e na visualização. */
export interface CourseRecord {
    id: number;
    name: string;
    description: string | null;
    is_active: boolean;
    disciplines?: CourseDisciplineOption[];
}

/** Linha da listagem (`CourseController@index`). */
export type CourseSummary = CourseRecord & {
    disciplines_count: number;
    student_courses_count: number;
};

export interface CoursePaginator extends TableListPage {
    data: CourseSummary[];
}

export type CourseFilters = {
    name: string;
    is_active: string;
};

export interface CourseListPermissions {
    create: boolean;
    view: boolean;
    delete: boolean;
}

export interface CourseIndexProps {
    courses: CoursePaginator;
    filters: Partial<CourseFilters>;
    can: CourseListPermissions;
}

export interface CourseCreateProps {
    disciplines: CourseDisciplineOption[];
}

export type CourseEditProps = CourseCreateProps & { course: CourseRecord };

export interface CourseDetailsPermissions {
    update: boolean;
    delete: boolean;
}

export interface CourseShowProps {
    course: CourseRecord;
    can: CourseDetailsPermissions;
}
