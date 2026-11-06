import { studentRecordUrl, studentUrls } from '@/components/Students/Students.routes';
import type { PageBreadcrumbItem } from '@/components/Navigation/PageBreadcrumb/PageBreadcrumb';
import { resourceBreadcrumb } from '@/components/Navigation/PageBreadcrumb/resourceBreadcrumb';
import { caseStudyName } from './CaseStudies.constants';

const base = '/estudos-de-caso';

/** Aba do prontuário do aluno que reúne os Estudos de Caso. */
export const caseStudiesTab = 'case-studies';

/**
 * Endereços das rotas `specialized-educational-support.case-study.*` e
 * `specialized-educational-support.students.case-studies.*`.
 */
export const caseStudyUrls = {
    all: base,
    create: (studentId: number) => `${base}/${studentId}/criar`,
    store: (studentId: number) => `${base}/${studentId}/salvar`,
    show: (id: number) => `${base}/${id}/visualizar`,
    edit: (id: number) => `${base}/${id}/editar`,
    update: (id: number) => `${base}/${id}`,
    destroy: (id: number) => `${base}/${id}`,
    complete: (id: number) => `${base}/${id}/concluir`,
    contributions: (id: number) => `${base}/${id}/contribuicoes`,
    pdf: (id: number) => `${base}/${id}/pdf`,
    /** Aba de Estudos de Caso do prontuário, destino de voltar/cancelar. */
    studentRecord: (studentId: number) => studentRecordUrl(studentId, caseStudiesTab),
    /** Cadastro do PAEE a partir de um Estudo de Caso concluído. */
    createPaee: (caseStudyId: number) => `/paees/${caseStudyId}/criar`,
};

/** Listagem geral: Home › Estudos de Caso. */
export function caseStudyAllBreadcrumb(): PageBreadcrumbItem[] {
    return resourceBreadcrumb({
        collection: { label: 'Estudos de Caso', href: caseStudyUrls.all },
    });
}

/**
 * Telas abertas a partir do aluno: Home › Alunos › Aluno › [Estudo de Caso] › Etapa. O aluno
 * leva à aba de Estudos de Caso do prontuário.
 */
export function caseStudyStudentBreadcrumb(
    student: { id: number; name: string },
    options: { caseStudy?: { id: number; version: number }; current?: string } = {},
): PageBreadcrumbItem[] {
    const { caseStudy, current } = options;

    return resourceBreadcrumb({
        parents: [{ label: 'Alunos', href: studentUrls.index }],
        collection: { label: student.name, href: caseStudyUrls.studentRecord(student.id) },
        record: caseStudy
            ? {
                  label: caseStudyName({ version: caseStudy.version }),
                  href: caseStudyUrls.show(caseStudy.id),
              }
            : undefined,
        current,
    });
}
