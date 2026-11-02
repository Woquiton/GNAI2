import { inclusionBase } from '@/components/Inclusion/Inclusion.routes';
import { studentRecordUrl, studentsBase } from '@/components/Inclusion/Students/Students.routes';
import type { PageBreadcrumbItem } from '@/components/Navigation/PageBreadcrumb/PageBreadcrumb';
import { resourceBreadcrumb } from '@/components/Navigation/PageBreadcrumb/resourceBreadcrumb';
import { paeeTitle } from './Paees.constants';
import type { PaeeStudentSummary } from './Paees.types';

const base = `${inclusionBase}/paees`;

/** Aba do prontuário do aluno que reúne os PAEEs. */
export const studentPaeesTab = 'paees';

/** Endereços das rotas `specialized-educational-support.paee.*` (prefixo `/inclusao/paees`). */
export const paeeUrls = {
    all: base,
    create: (caseStudyId: number) => `${base}/${caseStudyId}/criar`,
    store: `${base}/salvar`,
    show: (id: number) => `${base}/${id}/visualizar`,
    edit: (id: number) => `${base}/${id}/editar`,
    update: (id: number) => `${base}/${id}`,
    destroy: (id: number) => `${base}/${id}`,
    reviews: (id: number) => `${base}/${id}/revisoes`,
    pdf: (id: number) => `${base}/${id}/pdf`,
    caseStudy: (caseStudyId: number) =>
        `${inclusionBase}/estudos-de-caso/${caseStudyId}/visualizar`,
};

/** Listagem geral: Home › PAEEs. */
export function paeeAllBreadcrumb(): PageBreadcrumbItem[] {
    return resourceBreadcrumb({ collection: { label: 'PAEEs', href: paeeUrls.all } });
}

/**
 * Telas abertas a partir do aluno: Home › Alunos › Aluno › [PAEE] › Etapa.
 * O aluno leva à aba de PAEEs do prontuário.
 */
export function paeeStudentBreadcrumb(
    student: PaeeStudentSummary,
    options: {
        paee?: { id: number; label: string };
        current?: string;
    } = {},
): PageBreadcrumbItem[] {
    return resourceBreadcrumb({
        parents: [{ label: 'Alunos', href: studentsBase }],
        collection: {
            label: student.name,
            href: studentRecordUrl(student.id, studentPaeesTab),
        },
        record: options.paee
            ? { label: options.paee.label, href: paeeUrls.show(options.paee.id) }
            : undefined,
        current: options.current,
    });
}

/** Telas de um PAEE do aluno: Home › Alunos › Aluno › PAEE vX › [Etapa]. */
export function paeeRecordBreadcrumb(
    student: PaeeStudentSummary,
    paee: { id: number; version: number | null },
    current?: string,
): PageBreadcrumbItem[] {
    return paeeStudentBreadcrumb(student, {
        paee: { id: paee.id, label: paeeTitle(paee.version) },
        current,
    });
}
