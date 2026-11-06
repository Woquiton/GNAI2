import { resourceBreadcrumb } from '@/components/Navigation/PageBreadcrumb/resourceBreadcrumb';

const base = '/locais';

/** Endereços das rotas `inclusive-radar.locations.*` (prefixo `/locais`). */
export const locationUrls = {
    index: base,
    create: `${base}/criar`,
    store: `${base}/salvar`,
    show: (id: number) => `${base}/${id}`,
    edit: (id: number) => `${base}/${id}/editar`,
    update: (id: number) => `${base}/${id}`,
    destroy: (id: number) => `${base}/${id}`,
};

export function locationBreadcrumb(
    options: { location?: { id: number; name: string }; current?: string } = {},
) {
    return resourceBreadcrumb({
        collection: { label: 'Pontos de Referência', href: locationUrls.index },
        record: options.location
            ? { label: options.location.name, href: locationUrls.show(options.location.id) }
            : undefined,
        current: options.current,
    });
}
