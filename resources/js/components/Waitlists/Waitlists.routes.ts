import { itemUrls } from '@/components/Items/Items.routes';
import { resourceBreadcrumb } from '@/components/Navigation/PageBreadcrumb/resourceBreadcrumb';

const base = '/fila-de-espera';

/** Endereços das rotas `inclusive-radar.waitlists.*` (prefixo `/fila-de-espera`). */
export const waitlistUrls = {
    index: base,
    create: `${base}/criar`,
    store: `${base}/salvar`,
    show: (id: number) => `${base}/${id}`,
    edit: (id: number) => `${base}/${id}/editar`,
    update: (id: number) => `${base}/${id}`,
    destroy: (id: number) => `${base}/${id}`,
    cancel: (id: number) => `${base}/${id}/cancelar`,
    pdf: (id: number) => `${base}/${id}/pdf`,
    /** Cadastro do item solicitado, aberto em outra aba. */
    item: (itemId: number) => itemUrls.show(itemId),
};

export function waitlistBreadcrumb(options: { waitlist?: { id: number }; current?: string } = {}) {
    return resourceBreadcrumb({
        collection: { label: 'Fila de Espera', href: waitlistUrls.index },
        record: options.waitlist
            ? {
                  label: `Solicitação #${options.waitlist.id}`,
                  href: waitlistUrls.show(options.waitlist.id),
              }
            : undefined,
        current: options.current,
    });
}
