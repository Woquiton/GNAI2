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

export interface TeacherGlobalPermissionsProps {
    permissions: Record<string, Array<{ id: number; name: string; slug: string }>>;
    globalPermissionsIds: number[];
}

export interface TeacherDisciplinesProps {
    teacher: TeacherRecord;
    courses: Array<{
        id: number;
        name: string;
        disciplines: Array<{ id: number; name: string }>;
    }>;
    selectedByCourse: Record<string, Array<number | string>>;
}

export type TeacherFilters = {
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
}

export interface TeacherCourseDiscipline {
    id: number;
    course: { id: number; name: string } | null;
    discipline: { id: number; name: string } | null;
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
    display: { createdAt: string | null };
    impersonationUserId: number | null;
    can: TeacherDetailsPermissions;
}
