import {
    studentRecordUrl,
    studentsBase,
    studentUrl,
} from '@/components/Students/Students.routes';
import { resourceBreadcrumb } from '@/components/Navigation/PageBreadcrumb/resourceBreadcrumb';
import { STUDENT_COURSE_RECORD_TAB } from './StudentCourses.constants';

const base = '/cursos-do-aluno';

/** Endereços das rotas `specialized-educational-support.student-courses.*`. */
export const studentCourseUrls = {
    index: (studentId: number) => `${studentsBase}/${studentId}/historico`,
    create: (studentId: number) => `${base}/${studentId}/criar`,
    store: (studentId: number) => `${base}/salvar/${studentId}`,
    show: (id: number) => `${base}/${id}`,
    edit: (id: number) => `${base}/${id}/editar`,
    update: (id: number) => `${base}/${id}`,
    destroy: (id: number) => `${base}/${id}`,
    makeCurrent: (id: number) => `${base}/${id}/definir-atual`,
    /** Aba do prontuário de onde partem os fluxos de matrícula. */
    record: (studentId: number) => studentRecordUrl(studentId, STUDENT_COURSE_RECORD_TAB),
};

interface StudentCourseBreadcrumbOptions {
    student: { id: number; name: string };
    studentCourse?: { id: number; courseName: string };
    current?: string;
}

/** Home › Alunos › Aluno › Matrículas › [Curso] › [Etapa]. */
export function studentCourseBreadcrumb({
    student,
    studentCourse,
    current,
}: StudentCourseBreadcrumbOptions) {
    return resourceBreadcrumb({
        parents: [
            { label: 'Alunos', href: studentsBase },
            { label: student.name, href: studentUrl(student.id) },
        ],
        collection: { label: 'Matrículas', href: studentCourseUrls.index(student.id) },
        record: studentCourse
            ? { label: studentCourse.courseName, href: studentCourseUrls.show(studentCourse.id) }
            : undefined,
        current,
    });
}
