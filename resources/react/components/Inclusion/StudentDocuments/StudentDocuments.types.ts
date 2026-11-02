import type { TableListPage } from '@/components/Tables/TableList/TableList';

export interface StudentDocumentStudent {
    id: number;
    person: { name: string };
}

export interface StudentDocumentRecord {
    id: number;
    student_id: number;
    title: string;
    type: string;
    original_name: string;
}

/** Opções do cadastro e da edição (`StudentDocumentFormQuery`). */
export interface StudentDocumentFormOptions {
    student: StudentDocumentStudent;
    types: Record<string, string>;
    semester: { label: string } | null;
}

export type StudentDocumentEditProps = StudentDocumentFormOptions & {
    studentDocument: StudentDocumentRecord;
};

export type StudentDocumentListRecord = StudentDocumentRecord & {
    type_label: string;
    semester_label: string | null;
    file_size: number | null;
    created_at: string;
};

export interface StudentDocumentPaginator extends TableListPage {
    data: StudentDocumentListRecord[];
}

export type StudentDocumentFilters = {
    title: string;
    type: string;
    semester_id: string;
};

export interface StudentDocumentListPermissions {
    create: boolean;
    view: boolean;
    update: boolean;
    delete: boolean;
}

export interface StudentDocumentIndexProps {
    documents: StudentDocumentPaginator;
    student: StudentDocumentStudent;
    types: { value: string; label: string }[];
    semesters: { value: string; label: string }[];
    filters: Partial<StudentDocumentFilters>;
    can: StudentDocumentListPermissions;
}
