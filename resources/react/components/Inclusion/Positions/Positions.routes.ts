import { inclusionBase } from '@/components/Inclusion/Inclusion.routes';
import { resourceBreadcrumb } from '@/components/Navigation/PageBreadcrumb/resourceBreadcrumb';

const base = `${inclusionBase}/cargos`;

/** Endereços das rotas `specialized-educational-support.positions.*` (prefixo `/inclusao/cargos`). */
export const positionUrls = {
    index: base,
    create: `${base}/criar`,
    store: `${base}/salvar`,
    show: (id: number) => `${base}/${id}/visualizar`,
    edit: (id: number) => `${base}/${id}/editar`,
    update: (id: number) => `${base}/${id}`,
    toggleActive: (id: number) => `${base}/${id}/desativar`,
    destroy: (id: number) => `${base}/${id}`,
};

export function positionBreadcrumb(
    options: { position?: { id: number; name: string }; current?: string } = {},
) {
    return resourceBreadcrumb({
        collection: { label: 'Cargos', href: positionUrls.index },
        record: options.position
            ? { label: options.position.name, href: positionUrls.show(options.position.id) }
            : undefined,
        current: options.current,
    });
}
