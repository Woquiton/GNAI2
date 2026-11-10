export interface StudentDocumentStudent {
    id: number;
    person: { name: string };
}

export interface StudentDocumentRecord {
    id: number;
    student_id: number;
    title: string;
    type: string;
    custom_type: string | null;
    show_in_teacher_portal: boolean;
    original_name: string;
}

/** Opções do cadastro e da edição (`StudentDocumentFormQuery`). */
export interface StudentDocumentFormOptions {
    student: StudentDocumentStudent;
    types: Record<string, string>;
    customTypes: string[];
    semester: { label: string } | null;
}

export type StudentDocumentEditProps = StudentDocumentFormOptions & {
    studentDocument: StudentDocumentRecord;
};
