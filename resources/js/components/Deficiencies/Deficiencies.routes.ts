import { resourceBreadcrumb } from '@/components/Navigation/PageBreadcrumb/resourceBreadcrumb';

const base = '/deficiencias';

/** Endereços das rotas `specialized-educational-support.deficiencies.*`. */
export const deficiencyUrls = {
    index: base,
    create: `${base}/criar`,
    store: `${base}/salvar`,
    show: (id: number) => `${base}/${id}/visualizar`,
    edit: (id: number) => `${base}/${id}/editar`,
    update: (id: number) => `${base}/${id}`,
    toggleActive: (id: number) => `${base}/${id}/desativar`,
    destroy: (id: number) => `${base}/${id}`,
};

export function deficiencyBreadcrumb(
    options: { deficiency?: { id: number; name: string }; current?: string } = {},
) {
    return resourceBreadcrumb({
        collection: { label: 'Perfis de Atendimento', href: deficiencyUrls.index },
        record: options.deficiency
            ? { label: options.deficiency.name, href: deficiencyUrls.show(options.deficiency.id) }
            : undefined,
        current: options.current,
    });
}
