import type { PageBreadcrumbItem } from '@/components/Navigation/PageBreadcrumb/PageBreadcrumb';

export const teacherPortalBase = '/professor';

/** Endereços das rotas do Portal do Professor (prefixo `/professor`). */
export const teacherPortalUrls = {
    index: teacherPortalBase,
    student: (studentId: number) => `${teacherPortalBase}/alunos/${studentId}`,
    document: (documentId: number) => `${teacherPortalBase}/documentos/${documentId}`,
    editDiscipline: (peiDisciplineId: number) =>
        `${teacherPortalBase}/adaptacoes/${peiDisciplineId}/editar`,
    updateDiscipline: (peiDisciplineId: number) =>
        `${teacherPortalBase}/adaptacoes/${peiDisciplineId}`,
};

interface TeacherPortalBreadcrumbOptions {
    student?: { id: number; name: string };
    current?: string;
}

/**
 * Breadcrumb do portal: Portal do Professor › [Aluno] › [Etapa]. O professor não acessa o
 * painel administrativo, por isso o portal é a raiz no lugar de Home. O último nível nunca é link.
 */
export function teacherPortalBreadcrumb({
    student,
    current,
}: TeacherPortalBreadcrumbOptions = {}): PageBreadcrumbItem[] {
    const hasNext = Boolean(student || current);
    const items: PageBreadcrumbItem[] = [
        { label: 'Portal do Professor', href: hasNext ? teacherPortalUrls.index : undefined },
    ];

    if (student) {
        items.push({
            label: student.name,
            href: current ? teacherPortalUrls.student(student.id) : undefined,
        });
    }

    if (current) {
        items.push({ label: current });
    }

    return items;
}
