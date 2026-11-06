import { resourceBreadcrumb } from '@/components/Navigation/PageBreadcrumb/resourceBreadcrumb';

const base = '/categorias-de-barreira';

/** Endereços das rotas `inclusive-radar.barrier-categories.*`. */
export const barrierCategoryUrls = {
    index: base,
    create: `${base}/criar`,
    store: `${base}/salvar`,
    show: (id: number) => `${base}/${id}`,
    edit: (id: number) => `${base}/${id}/editar`,
    update: (id: number) => `${base}/${id}`,
    destroy: (id: number) => `${base}/${id}`,
};

export function barrierCategoryBreadcrumb(
    options: { category?: { id: number; name: string }; current?: string } = {},
) {
    return resourceBreadcrumb({
        collection: { label: 'Categorias de Barreiras', href: barrierCategoryUrls.index },
        record: options.category
            ? {
                  label: options.category.name,
                  href: barrierCategoryUrls.show(options.category.id),
              }
            : undefined,
        current: options.current,
    });
}
