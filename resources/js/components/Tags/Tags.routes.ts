import { resourceBreadcrumb } from '@/components/Navigation/PageBreadcrumb/resourceBreadcrumb';

const base = '/marcadores';

/** Endereços das rotas `inclusive-radar.tags.*`. */
export const tagUrls = {
    index: base,
    create: `${base}/criar`,
    store: `${base}/salvar`,
    show: (id: number) => `${base}/${id}`,
    edit: (id: number) => `${base}/${id}/editar`,
    update: (id: number) => `${base}/${id}`,
    destroy: (id: number) => `${base}/${id}`,
};

export function tagBreadcrumb(
    options: { tag?: { id: number; name: string }; current?: string } = {},
) {
    return resourceBreadcrumb({
        collection: { label: 'Etiquetas', href: tagUrls.index },
        record: options.tag
            ? { label: options.tag.name, href: tagUrls.show(options.tag.id) }
            : undefined,
        current: options.current,
    });
}
