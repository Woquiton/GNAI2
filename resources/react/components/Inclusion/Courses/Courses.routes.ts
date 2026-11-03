import { inclusionBase } from '@/components/Inclusion/Inclusion.routes';
import { resourceBreadcrumb } from '@/components/Navigation/PageBreadcrumb/resourceBreadcrumb';

const base = `${inclusionBase}/cursos`;

/** Endereços das rotas `specialized-educational-support.courses.*` (prefixo `/inclusao/cursos`). */
export const courseUrls = {
    index: base,
    create: `${base}/criar`,
    store: `${base}/salvar`,
    show: (id: number) => `${base}/${id}/visualizar`,
    edit: (id: number) => `${base}/${id}/editar`,
    update: (id: number) => `${base}/${id}`,
    destroy: (id: number) => `${base}/${id}`,
    rollover: (id: number) => `${base}/${id}/virada-de-semestre`,
    rolloverInSemester: (id: number, semesterId: number) =>
        `${base}/${id}/virada-de-semestre?semestre=${semesterId}`,
    rolloverStore: (id: number) => `${base}/${id}/virada-de-semestre/salvar`,
};

export function courseBreadcrumb(
    options: { course?: { id: number; name: string }; current?: string } = {},
) {
    return resourceBreadcrumb({
        collection: { label: 'Cursos', href: courseUrls.index },
        record: options.course
            ? { label: options.course.name, href: courseUrls.show(options.course.id) }
            : undefined,
        current: options.current,
    });
}
