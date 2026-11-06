import { resourceBreadcrumb } from '@/components/Navigation/PageBreadcrumb/resourceBreadcrumb';

const base = '/disciplinas';

/** Endereços das rotas `specialized-educational-support.disciplines.*` (prefixo `/disciplinas`). */
export const disciplineUrls = {
    index: base,
    create: `${base}/criar`,
    store: `${base}/salvar`,
    show: (id: number) => `${base}/${id}/visualizar`,
    edit: (id: number) => `${base}/${id}/editar`,
    update: (id: number) => `${base}/${id}`,
    destroy: (id: number) => `${base}/${id}`,
};

export function disciplineBreadcrumb(
    options: { discipline?: { id: number; name: string }; current?: string } = {},
) {
    return resourceBreadcrumb({
        collection: { label: 'Disciplinas', href: disciplineUrls.index },
        record: options.discipline
            ? { label: options.discipline.name, href: disciplineUrls.show(options.discipline.id) }
            : undefined,
        current: options.current,
    });
}
