import { resourceBreadcrumb } from '@/components/Navigation/PageBreadcrumb/resourceBreadcrumb';

const base = '/inclusao/itens';

/** Endereços das rotas `inclusive-radar.items.*` (prefixo `/inclusao/itens`). */
export const itemUrls = {
    index: base,
    setCover: (itemId: number, evidenceId: number) => `${base}/${itemId}/capa/${evidenceId}`,
    create: `${base}/criar`,
    store: `${base}/salvar`,
    show: (id: number) => `${base}/${id}`,
    edit: (id: number) => `${base}/${id}/editar`,
    update: (id: number) => `${base}/${id}`,
    destroy: (id: number) => `${base}/${id}`,
    clone: (id: number) => `${base}/${id}/duplicar`,
    pdf: (id: number) => `${base}/${id}/pdf`,
};

export function itemBreadcrumb(
    options: { item?: { id: number; name: string }; current?: string } = {},
) {
    return resourceBreadcrumb({
        collection: { label: 'Itens', href: itemUrls.index },
        record: options.item
            ? { label: options.item.name, href: itemUrls.show(options.item.id) }
            : undefined,
        current: options.current,
    });
}
