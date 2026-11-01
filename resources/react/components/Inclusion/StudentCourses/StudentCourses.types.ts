import type { TableListPage } from '@/components/Tables/TableList/TableList';

export interface StudentCourseDiscipline {
    id: number;
    name: string;
    description?: string | null;
}

export interface StudentCourseCourse {
    id: number;
    name: string;
    description?: string | null;
    disciplines?: StudentCourseDiscipline[];
}

export interface StudentCourseSemester {
    id: number;
    label: string;
}

export interface StudentCourseStudent {
    id: number;
    registration: string | null;
    person: { name: string };
}

/** Matrícula usada na edição (`StudentCourseFormQuery@forUpdate`). */
export interface StudentCourseRecord {
    id: number;
    student_id: number;
    course_id: number;
    academic_year: number | string | null;
    semester_id: number | null;
    semester?: StudentCourseSemester | null;
    is_current: boolean;
    school_attendance_status: string | null;
    student: StudentCourseStudent;
    course: StudentCourseCourse;
    failed_disciplines?: { id: number }[];
    at_risk_disciplines?: { id: number }[];
}

/** Matrícula da visualização (`StudentCourseController@show`). */
export type StudentCourseShowRecord = Omit<
    StudentCourseRecord,
    'failed_disciplines' | 'at_risk_disciplines'
> & {
    failed_disciplines: StudentCourseDiscipline[];
    at_risk_disciplines: StudentCourseDiscipline[];
    created_at: string | null;
    updated_at: string | null;
};

/** Linha da listagem (`StudentCourseController@index`). */
export interface StudentCourseListRecord {
    id: number;
    academic_year: number | string | null;
    semester?: StudentCourseSemester | null;
    is_current: boolean;
    course: { id: number; name: string } | null;
}

export interface StudentCoursePaginator extends TableListPage {
    data: StudentCourseListRecord[];
}

export type StudentCourseFilters = {
    course_id: string;
    academic_year: string;
    is_current: string;
};

export interface StudentCourseListPermissions {
    create: boolean;
    view: boolean;
    delete: boolean;
}

export interface StudentCourseIndexProps {
    student: { id: number; person: { name: string } };
    studentCourses: StudentCoursePaginator;
    courses: { value: string; label: string }[];
    filters: Partial<StudentCourseFilters>;
    can: StudentCourseListPermissions;
}

export interface StudentCourseCreateProps {
    student: StudentCourseStudent;
    courses: StudentCourseCourse[];
    semesters: StudentCourseSemester[];
    mustBeCurrent: boolean;
}

export interface StudentCourseEditProps {
    studentCourse: StudentCourseRecord;
    semesters: StudentCourseSemester[];
}

export interface StudentCourseDetailsPermissions {
    update: boolean;
    delete: boolean;
}

export interface StudentCourseShowProps {
    studentCourse: StudentCourseShowRecord;
    can: StudentCourseDetailsPermissions;
}
