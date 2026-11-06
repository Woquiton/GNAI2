export interface StudentDeficiencyStudent {
    id: number;
    person: { name: string };
}

/** Vínculo do aluno com um perfil de atendimento (`StudentDeficiencyFormQuery@forUpdate`). */
export interface StudentDeficiencyRecord {
    id: number;
    deficiency_id: number;
    severity: string | null;
    notes: string | null;
    deficiency: { id: number; name: string } | null;
}

export interface DeficiencyOption {
    id: number;
    name: string;
}

/** Dados do vínculo com rótulo e tom da severidade. */
export type StudentDeficiencyListRecord = StudentDeficiencyRecord & {
    severity_label: string | null;
    severity_color: string | null;
};

export type StudentDeficiencyShowRecord = StudentDeficiencyListRecord & {
    created_at: string | null;
    /** Observações já sanitizadas pelo `RichTextSanitizer`. */
    notes_html: string;
};

export interface StudentDeficiencyCreateProps {
    student: StudentDeficiencyStudent;
    deficienciesList: DeficiencyOption[];
}

export interface StudentDeficiencyEditProps {
    student: StudentDeficiencyStudent;
    student_deficiency: StudentDeficiencyRecord;
}

export interface StudentDeficiencyDetailsPermissions {
    update: boolean;
    delete: boolean;
}

export interface StudentDeficiencyShowProps {
    student: StudentDeficiencyStudent;
    deficiency: StudentDeficiencyShowRecord;
    can: StudentDeficiencyDetailsPermissions;
}
