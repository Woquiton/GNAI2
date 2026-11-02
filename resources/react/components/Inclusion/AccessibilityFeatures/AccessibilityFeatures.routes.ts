import { inclusionBase } from '@/components/Inclusion/Inclusion.routes';
import { resourceBreadcrumb } from '@/components/Navigation/PageBreadcrumb/resourceBreadcrumb';

const base = `${inclusionBase}/recursos-de-acessibilidade`;

/** Endereços das rotas `inclusive-radar.accessibility-features.*`. */
export const accessibilityFeatureUrls = {
    index: base,
    create: `${base}/criar`,
    store: `${base}/salvar`,
    show: (id: number) => `${base}/${id}`,
    edit: (id: number) => `${base}/${id}/editar`,
    update: (id: number) => `${base}/${id}`,
    destroy: (id: number) => `${base}/${id}`,
};

export function accessibilityFeatureBreadcrumb(
    options: { feature?: { id: number; name: string }; current?: string } = {},
) {
    return resourceBreadcrumb({
        collection: { label: 'Recursos de Acessibilidade', href: accessibilityFeatureUrls.index },
        record: options.feature
            ? {
                  label: options.feature.name,
                  href: accessibilityFeatureUrls.show(options.feature.id),
              }
            : undefined,
        current: options.current,
    });
}
