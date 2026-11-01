import { inclusionBase } from '@/components/Inclusion/Inclusion.routes';
import { resourceBreadcrumb } from '@/components/Navigation/PageBreadcrumb/resourceBreadcrumb';

const base = `${inclusionBase}/profissionais`;

/** Endereços das rotas `specialized-educational-support.professionals.*`. */
export const professionalUrls = {
    index: base,
    create: `${base}/criar`,
    store: `${base}/salvar`,
    show: (id: number) => `${base}/${id}/visualizar`,
    edit: (id: number) => `${base}/${id}/editar`,
    update: (id: number) => `${base}/${id}`,
    destroy: (id: number) => `${base}/${id}`,
};

export function professionalBreadcrumb(
    options: { professional?: { id: number; name: string }; current?: string } = {},
) {
    return resourceBreadcrumb({
        collection: { label: 'Profissionais', href: professionalUrls.index },
        record: options.professional
            ? {
                  label: options.professional.name,
                  href: professionalUrls.show(options.professional.id),
              }
            : undefined,
        current: options.current,
    });
}
