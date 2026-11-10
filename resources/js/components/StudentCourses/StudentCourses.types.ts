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

/** Reprovação de semestre anterior ainda pendente a partir de um semestre. */
export interface StudentCourseDependency {
    discipline_id: number;
    name: string;
    failed_semester_label: string | null;
    /** Aprovada no próprio semestre consultado. */
    resolved: boolean;
}

/** Dados acadêmicos da matrícula em um semestre (`StudentCourseFormQuery@forUpdate`). */
export interface StudentCourseSemesterAcademicRecords {
    course_period: number | null;
    failed: number[];
    at_risk: number[];
    dependencies: StudentCourseDependency[];
}

/** Reprovações, riscos e dependências aprovadas de um semestre (`StudentCourseController@show`). */
export interface StudentCourseAcademicHistoryEntry {
    semester_id: number;
    semester_label: string;
    failed: string[];
    at_risk: string[];
    resolved: string[];
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
}

/** Período do curso do aluno em um semestre letivo da matrícula. */
export interface StudentCourseSemesterRecord {
    id: number;
    semester_id: number;
    course_period: number;
    semester?: StudentCourseSemester | null;
}

/** Matrícula da visualização (`StudentCourseController@show`). */
export type StudentCourseShowRecord = StudentCourseRecord & {
    /** Do semestre mais recente para o mais antigo. */
    semester_records: StudentCourseSemesterRecord[];
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
    created_from: string;
    created_to: string;
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
    maxCoursePeriod: number;
    /** Semestre atual, padrão do novo vínculo. */
    currentSemesterId: number | null;
}

export interface StudentCourseEditProps {
    studentCourse: StudentCourseRecord;
    semesters: StudentCourseSemester[];
    /** Período do curso no semestre da matrícula, quando informado. */
    coursePeriod: number | null;
    maxCoursePeriod: number;
    /** Por id do semestre: período, reprovações, riscos e dependências. */
    academicRecordsBySemester: Record<string, StudentCourseSemesterAcademicRecords>;
}

export interface StudentCourseDetailsPermissions {
    update: boolean;
    delete: boolean;
}

/** Textos ricos já sanitizados pelo `RichTextSanitizer` (`StudentCourseController@show`). */
export interface StudentCourseShowDisplay {
    courseDescriptionHtml: string;
    schoolAttendanceStatusHtml: string;
}

export interface StudentCourseShowProps {
    studentCourse: StudentCourseShowRecord;
    /** Do semestre mais recente para o mais antigo. */
    academicHistory: StudentCourseAcademicHistoryEntry[];
    /** Dependências ainda não aprovadas, a partir do semestre da matrícula. */
    pendingDependencies: Omit<StudentCourseDependency, 'resolved'>[];
    display: StudentCourseShowDisplay;
    can: StudentCourseDetailsPermissions;
}
