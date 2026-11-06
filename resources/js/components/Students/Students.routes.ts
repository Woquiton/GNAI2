import type { PageBreadcrumbItem } from '@/components/Navigation/PageBreadcrumb/PageBreadcrumb';
import { resourceBreadcrumb } from '@/components/Navigation/PageBreadcrumb/resourceBreadcrumb';

export const studentsBase = `/alunos`;

export const studentUrl = (id: number, action = 'visualizar'): string =>
    `${studentsBase}/${id}${action ? `/${action}` : ''}`;

/** Prontuário do aluno aberto na aba indicada. */
export const studentRecordUrl = (id: number, tab: string): string => {
    const query = new URLSearchParams({ tab });

    return `${studentUrl(id)}?${query.toString()}`;
};

/** Endereços das rotas `specialized-educational-support.students.*` (prefixo `/alunos`). */
export const studentUrls = {
    index: studentsBase,
    create: `${studentsBase}/criar`,
    store: `${studentsBase}/salvar`,
    show: (id: number) => studentUrl(id),
    edit: (id: number) => studentUrl(id, 'editar'),
    update: (id: number) => studentUrl(id, ''),
    destroy: (id: number) => studentUrl(id, ''),
    pdf: (id: number) => studentUrl(id, 'pdf'),
};

interface StudentReference {
    id: number;
    person: { name: string };
}

export function studentBreadcrumb(
    options: { student?: StudentReference; current?: string } = {},
): PageBreadcrumbItem[] {
    return resourceBreadcrumb({
        collection: { label: 'Alunos', href: studentUrls.index },
        record: options.student
            ? { label: options.student.person.name, href: studentUrls.show(options.student.id) }
            : undefined,
        current: options.current,
    });
}

/** Níveis Alunos › Aluno (entre Home e a coleção) usados pelos cadastros abertos a partir do prontuário. */
export function studentRecordBreadcrumbParents(student: StudentReference): PageBreadcrumbItem[] {
    return [
        { label: 'Alunos', href: studentUrls.index },
        { label: student.person.name, href: studentUrls.show(student.id) },
    ];
}
