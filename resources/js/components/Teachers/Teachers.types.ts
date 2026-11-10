import type { TableListPage } from '@/components/Tables/TableList/TableList';

export interface TeacherPerson {
    id: number;
    name: string;
    document: string | null;
    birth_date: string | null;
    gender: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    photo: string | null;
    photo_url?: string | null;
}

export interface TeacherRecord {
    id: number;
    person: TeacherPerson;
    registration: string;
}

export interface TeacherEditProps {
    teacher: TeacherRecord;
}

export interface TeacherSemesterOption {
    id: number;
    label: string;
}

export interface TeacherDisciplinesProps {
    teacher: TeacherRecord;
    courses: Array<{
        id: number;
        name: string;
        disciplines: Array<{
            id: number;
            name: string;
            pivot?: { course_period: number | null } | null;
        }>;
    }>;
    /** Vínculos do professor no semestre exibido. */
    selectedByCourse: Record<string, Array<number | string>>;
    semesters: TeacherSemesterOption[];
    /** Semestre exibido; nulo quando ainda não há semestre cadastrado. */
    semester: TeacherSemesterOption | null;
    /** Semestre anterior mais recente com vínculos deste professor, para copiar. */
    previousSemester: TeacherSemesterOption | null;
}

export type TeacherFilters = {
    course_name: string;
    discipline_name: string;

    created_from: string;
    created_to: string;
    name: string;
    email: string;
    registration: string;
};

export interface TeacherPaginator extends TableListPage {
    data: TeacherRecord[];
}

export interface TeacherListPermissions {
    create: boolean;
    view: boolean;
    update: boolean;
    delete: boolean;
}

export interface TeacherIndexProps {
    teachers: TeacherPaginator;
    filters: Partial<TeacherFilters>;
    can: TeacherListPermissions;
    /** Cópia dos vínculos de todos os professores do semestre anterior para o atual. */
    assignmentCopy: {
        target: TeacherSemesterOption | null;
        source: TeacherSemesterOption | null;
    };
}

export interface TeacherCourseDiscipline {
    id: number;
    course: { id: number; name: string } | null;
    discipline: { id: number; name: string } | null;
    semester: TeacherSemesterOption | null;
}

export interface TeacherDetailsPermissions {
    update: boolean;
    delete: boolean;
}

/** Dados da visualização (`TeacherController@show`). */
export interface TeacherShowProps {
    teacher: TeacherRecord & {
        course_disciplines: TeacherCourseDiscipline[];
    };
    display: { createdAt: string | null; addressHtml: string };
    impersonationUserId: number | null;
    can: TeacherDetailsPermissions;
}
