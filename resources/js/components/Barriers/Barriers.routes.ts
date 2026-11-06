import { resourceBreadcrumb } from '@/components/Navigation/PageBreadcrumb/resourceBreadcrumb';

const base = '/barreiras';

/** Endereços das rotas `inclusive-radar.barriers.*` (prefixo `/barreiras`). */
export const barrierUrls = {
    index: base,
    create: `${base}/criar`,
    store: `${base}/salvar`,
    show: (id: number) => `${base}/${id}`,
    edit: (id: number) => `${base}/${id}/editar`,
    update: (id: number) => `${base}/${id}`,
    destroy: (id: number) => `${base}/${id}`,
    pdf: (id: number) => `${base}/${id}/pdf`,
};

/** Endereço público de uma evidência gravada no disco `public`. */
export function evidenceUrl(path: string): string {
    return `/storage/${path.split('/').map(encodeURIComponent).join('/')}`;
}

export function barrierBreadcrumb(
    options: { barrier?: { id: number; name: string }; current?: string } = {},
) {
    return resourceBreadcrumb({
        collection: { label: 'Barreiras', href: barrierUrls.index },
        record: options.barrier
            ? { label: options.barrier.name, href: barrierUrls.show(options.barrier.id) }
            : undefined,
        current: options.current,
    });
}
