import { resourceBreadcrumb } from '@/components/Navigation/PageBreadcrumb/resourceBreadcrumb';

const base = '/pendencias';

/** Endereços das rotas `specialized-educational-support.pendencies.*`. */
export const pendencyUrls = {
    index: base,
    my: `/minhas-pendencias`,
    create: `${base}/criar`,
    store: `${base}/salvar`,
    show: (id: number) => `${base}/${id}/visualizar`,
    edit: (id: number) => `${base}/${id}/editar`,
    update: (id: number) => `${base}/${id}`,
    destroy: (id: number) => `${base}/${id}`,
    complete: (id: number) => `${base}/${id}/concluir`,
};

export function pendencyBreadcrumb(
    options: { record?: { id: number; label: string }; current?: string } = {},
) {
    return resourceBreadcrumb({
        collection: { label: 'Pendências', href: pendencyUrls.index },
        record: options.record
            ? { label: options.record.label, href: pendencyUrls.show(options.record.id) }
            : undefined,
        current: options.current,
    });
}
