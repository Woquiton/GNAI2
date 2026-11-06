import type { TableListPage } from '@/components/Tables/TableList/TableList';

/** Disciplina ativa oferecida na matriz curricular. */
export interface CourseDisciplineOption {
    id: number;
    name: string;
}

/** Disciplina da matriz, com o período do curso em que é cursada (`course_disciplines`). */
export interface CourseCurriculumDiscipline extends CourseDisciplineOption {
    pivot?: { course_period: number | null } | null;
}

/** Registro usado na edição e na visualização. */
export interface CourseRecord {
    id: number;
    name: string;
    description: string | null;
    is_active: boolean;
    disciplines?: CourseCurriculumDiscipline[];
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
    maxCoursePeriod: number;
}

export type CourseEditProps = CourseCreateProps & { course: CourseRecord };

export interface CourseDetailsPermissions {
    update: boolean;
    delete: boolean;
    /** Virada de semestre dos alunos (`student-course.update`). */
    rollover: boolean;
}

/** Situação do aluno na virada: avança um período, permanece no mesmo ou não é registrado. */
export type CourseRolloverAction = 'advance' | 'retain' | 'skip';

/** Aluno ativo com matrícula vigente no curso (`CourseRolloverQuery`). */
export interface CourseRolloverStudent {
    student_course_id: number;
    student_name: string;
    registration: string | null;
    /** Período no último semestre anterior ao de destino; nulo quando não há registro. */
    previous_period: number | null;
    previous_semester_label: string | null;
    /** Período já registrado no semestre de destino, quando houver. */
    target_period: number | null;
    default_action: CourseRolloverAction;
}

export interface CourseRolloverProps {
    course: { id: number; name: string };
    semesters: Array<{ id: number; label: string }>;
    /** Semestre de destino; nulo quando não há semestre cadastrado. */
    semester: { id: number; label: string } | null;
    maxCoursePeriod: number;
    students: CourseRolloverStudent[];
}

export interface CourseShowProps {
    course: CourseRecord;
    /** Descrição já sanitizada pelo `RichTextSanitizer` (`CourseController@show`). */
    display: { descriptionHtml: string };
    can: CourseDetailsPermissions;
}
