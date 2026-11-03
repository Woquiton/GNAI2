import { resourceBreadcrumb } from '@/components/Navigation/PageBreadcrumb/resourceBreadcrumb';

const base = '/inclusao/solicitacoes-de-atendimento';
export const supportRequestUrls = {
    index: base,
    create: `${base}/criar`,
    createForStudent: (id: number) => `${base}/criar?student_id=${id}`,
    forStudent: (id: number) => `${base}?student_id=${id}`,
    store: `${base}/salvar`,
    show: (id: number) => `${base}/${id}/visualizar`,
    edit: (id: number) => `${base}/${id}/editar`,
    update: (id: number) => `${base}/${id}`,
    destroy: (id: number) => `${base}/${id}`,
    pdf: (id: number) => `${base}/${id}/pdf`,
};
export function supportRequestBreadcrumb(record?: { id: number }, current?: string) {
    return resourceBreadcrumb({
        collection: { label: 'Solicitações de Atendimento', href: base },
        record: record
            ? { label: `Solicitação #${record.id}`, href: supportRequestUrls.show(record.id) }
            : undefined,
        current,
    });
}
