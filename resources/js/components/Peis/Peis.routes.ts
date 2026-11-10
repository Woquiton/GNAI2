import { studentRecordUrl, studentUrl, studentsBase } from '@/components/Students/Students.routes';
import type { PageBreadcrumbItem } from '@/components/Navigation/PageBreadcrumb/PageBreadcrumb';
import { resourceBreadcrumb } from '@/components/Navigation/PageBreadcrumb/resourceBreadcrumb';
import type { PeiCreateProps } from './Peis.types';

const base = '/peis';

/** Endereços das rotas `specialized-educational-support.pei.*`. */
export const peiUrls = {
    all: base,
    studentIndex: (studentId: number) => `${studentsBase}/${studentId}/peis`,
    create: (studentId: number) => `${studentsBase}/${studentId}/peis/criar`,
    store: (studentId: number) => `${base}/aluno/${studentId}/salvar`,
    show: (id: number) => `${base}/${id}/visualizar`,
    /** Visualização aberta na aba indicada (por exemplo, `disciplines`). */
    showTab: (id: number, tab: string) => `${base}/${id}/visualizar?tab=${tab}`,
    destroy: (id: number) => `${base}/${id}`,
    finish: (id: number) => `${base}/${id}/finalizar`,
    otherInfo: (id: number) => `${base}/${id}/outras-informacoes`,
    pdf: (id: number) => `${base}/${id}/pdf`,
    familyPdf: (id: number) => `${base}/${id}/pdf-familia`,
};

/** Endereços das rotas `specialized-educational-support.pei-discipline.*`. */
export const peiDisciplineUrls = {
    create: (peiId: number) => `${base}/${peiId}/disciplinas/criar`,
    store: (peiId: number) => `${base}/${peiId}/disciplinas/salvar`,
    show: (peiId: number, id: number) => `${base}/${peiId}/disciplinas/${id}/visualizar`,
    edit: (peiId: number, id: number) => `${base}/${peiId}/disciplinas/${id}/editar`,
    update: (peiId: number, id: number) => `${base}/${peiId}/disciplinas/${id}`,
    destroy: (peiId: number, id: number) => `${base}/${peiId}/disciplinas/${id}`,
    pdf: (peiId: number, id: number) => `${base}/${peiId}/disciplinas/${id}/pdf`,
    revisions: (peiId: number, id: number) => `${base}/${peiId}/disciplinas/${id}/revisoes`,
    stopReminders: (peiId: number, id: number) =>
        `${base}/${peiId}/disciplinas/${id}/lembretes/encerrar`,
    resumeReminders: (peiId: number, id: number) =>
        `${base}/${peiId}/disciplinas/${id}/lembretes/retomar`,
};

const studentsCrumb: PageBreadcrumbItem = { label: 'Alunos', href: studentsBase };

/** Listagem geral: Home › PEIs. */
export function peiAllBreadcrumb(): PageBreadcrumbItem[] {
    return resourceBreadcrumb({ collection: { label: 'PEIs', href: peiUrls.all } });
}

/** Histórico do aluno: Home › Alunos › Aluno (aba PEIs) › PEIs. */
export function studentPeisBreadcrumb(student: { id: number; name: string }): PageBreadcrumbItem[] {
    return resourceBreadcrumb({
        parents: [
            studentsCrumb,
            { label: student.name, href: studentRecordUrl(student.id, 'peis') },
        ],
        collection: { label: 'PEIs', href: peiUrls.studentIndex(student.id) },
    });
}

/** Geração: Home › Alunos › Aluno › PEIs › Gerar Novo. */
export function peiCreateBreadcrumb(student: PeiCreateProps['student']): PageBreadcrumbItem[] {
    return resourceBreadcrumb({
        parents: [
            studentsCrumb,
            { label: student.person?.name ?? '', href: studentUrl(student.id) },
        ],
        collection: { label: 'PEIs', href: peiUrls.studentIndex(student.id) },
        current: 'Gerar Novo',
    });
}

/** Visualização: Home › Alunos › Aluno › PEIs (aba do prontuário) › PEI #id. */
export function peiShowBreadcrumb(
    pei: { id: number },
    student: { id: number; name: string },
): PageBreadcrumbItem[] {
    return resourceBreadcrumb({
        parents: [studentsCrumb, { label: student.name, href: studentUrl(student.id) }],
        collection: { label: 'PEIs', href: studentRecordUrl(student.id, 'peis') },
        record: { label: `PEI #${pei.id}`, href: peiUrls.show(pei.id) },
    });
}

/**
 * Telas das adaptações curriculares, abertas a partir da aba de disciplinas do PEI:
 * Home › Alunos › [Aluno] › PEI › Etapa.
 */
export function peiDisciplineBreadcrumb({
    peiId,
    peiLabel,
    student,
    current,
}: {
    peiId: number;
    peiLabel: string;
    student?: { id: number; name: string };
    current: string;
}): PageBreadcrumbItem[] {
    const parents = student
        ? [studentsCrumb, { label: student.name, href: studentUrl(student.id) }]
        : [studentsCrumb];

    return resourceBreadcrumb({
        parents,
        collection: { label: peiLabel, href: peiUrls.showTab(peiId, 'disciplines') },
        current,
    });
}
