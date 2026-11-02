import {
    studentRecordUrl,
    studentsBase,
    studentUrl,
} from '@/components/Inclusion/Students/Students.routes';
import { resourceBreadcrumb } from '@/components/Navigation/PageBreadcrumb/resourceBreadcrumb';
import { STUDENT_DEFICIENCY_RECORD_TAB } from './StudentDeficiencies.constants';

const base = (studentId: number) => `${studentsBase}/${studentId}/deficiencias`;

/** Endereços das rotas `specialized-educational-support.student-deficiencies.*`. */
export const studentDeficiencyUrls = {
    index: base,
    create: (studentId: number) => `${base(studentId)}/criar`,
    store: base,
    show: (studentId: number, id: number) => `${base(studentId)}/${id}`,
    edit: (studentId: number, id: number) => `${base(studentId)}/${id}/editar`,
    update: (studentId: number, id: number) => `${base(studentId)}/${id}`,
    destroy: (studentId: number, id: number) => `${base(studentId)}/${id}`,
    /** Aba do prontuário que reúne os perfis de atendimento. */
    record: (studentId: number) => studentRecordUrl(studentId, STUDENT_DEFICIENCY_RECORD_TAB),
};

interface StudentDeficiencyBreadcrumbOptions {
    student: { id: number; person: { name: string } };
    studentDeficiency?: { id: number; deficiency: { name: string } | null };
    current?: string;
}

/** Home › Alunos › Aluno › Perfis de Atendimento (aba do prontuário) › [Perfil] › [Etapa]. */
export function studentDeficiencyBreadcrumb({
    student,
    studentDeficiency,
    current,
}: StudentDeficiencyBreadcrumbOptions) {
    return resourceBreadcrumb({
        parents: [
            { label: 'Alunos', href: studentsBase },
            { label: student.person.name, href: studentUrl(student.id) },
        ],
        collection: {
            label: 'Perfis de Atendimento',
            href: studentDeficiencyUrls.record(student.id),
        },
        record: studentDeficiency?.deficiency
            ? {
                  label: studentDeficiency.deficiency.name,
                  href: studentDeficiencyUrls.show(student.id, studentDeficiency.id),
              }
            : undefined,
        current,
    });
}
