import { studentsBase, studentUrl } from '@/components/Students/Students.routes';
import type { PageBreadcrumbItem } from '@/components/Navigation/PageBreadcrumb/PageBreadcrumb';
import {
    DASHBOARD_BREADCRUMB,
    resourceBreadcrumb,
} from '@/components/Navigation/PageBreadcrumb/resourceBreadcrumb';

const base = '/agendamentos';

/** Endereços das rotas `specialized-educational-support.sessions.*` (prefixo `/agendamentos`). */
export const sessionUrls = {
    index: base,
    mySessions: `/meus-agendamentos`,
    create: `${base}/criar`,
    store: `${base}/salvar`,
    availability: `${base}/disponibilidade`,
    show: (id: number) => `${base}/${id}/visualizar`,
    edit: (id: number) => `${base}/${id}/editar`,
    update: (id: number) => `${base}/${id}`,
    destroy: (id: number) => `${base}/${id}`,
    cancel: (id: number) => `${base}/${id}/cancelar`,
    /** Rota `specialized-educational-support.students.sessions.index`. */
    student: (studentId: number) => studentUrl(studentId, 'agendamentos'),
};

/** Home › Agendamentos › [Agendamento #id] › [Etapa]. */
export function sessionBreadcrumb(
    options: { session?: { id: number }; current?: string } = {},
): PageBreadcrumbItem[] {
    return resourceBreadcrumb({
        collection: { label: 'Agendamentos', href: sessionUrls.index },
        record: options.session
            ? {
                  label: `Agendamento #${options.session.id}`,
                  href: sessionUrls.show(options.session.id),
              }
            : undefined,
        current: options.current,
    });
}

/** A central de agendamentos só vira link para quem pode consultá-la (`session.view-all`). */
export function mySessionsBreadcrumb(canViewAll: boolean): PageBreadcrumbItem[] {
    return [
        DASHBOARD_BREADCRUMB,
        { label: 'Agendamentos', href: canViewAll ? sessionUrls.index : undefined },
        { label: 'Meus Agendamentos' },
    ];
}

/** Home › Alunos › Aluno › Agendamentos. */
export function studentSessionsBreadcrumb(student: {
    id: number;
    name: string;
}): PageBreadcrumbItem[] {
    return resourceBreadcrumb({
        parents: [
            { label: 'Alunos', href: studentsBase },
            { label: student.name, href: studentUrl(student.id) },
        ],
        collection: { label: 'Agendamentos', href: sessionUrls.student(student.id) },
    });
}
