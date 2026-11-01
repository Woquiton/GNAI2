import { inclusionBase } from '@/components/Inclusion/Inclusion.routes';
import { resourceBreadcrumb } from '@/components/Navigation/PageBreadcrumb/resourceBreadcrumb';

const base = `${inclusionBase}/instituicoes`;

/** Endereços das rotas `inclusive-radar.institutions.*` (prefixo `/inclusao/instituicoes`). */
export const institutionUrls = {
    index: base,
    create: `${base}/criar`,
    store: `${base}/salvar`,
    show: (id: number) => `${base}/${id}`,
    edit: (id: number) => `${base}/${id}/editar`,
    update: (id: number) => `${base}/${id}`,
    destroy: (id: number) => `${base}/${id}`,
};

export function institutionBreadcrumb(
    options: { institution?: { id: number; name: string }; current?: string } = {},
) {
    return resourceBreadcrumb({
        collection: { label: 'Instituições', href: institutionUrls.index },
        record: options.institution
            ? {
                  label: options.institution.name,
                  href: institutionUrls.show(options.institution.id),
              }
            : undefined,
        current: options.current,
    });
}
