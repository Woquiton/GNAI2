import { resourceBreadcrumb } from '@/components/Navigation/PageBreadcrumb/resourceBreadcrumb';

const base = '/notificacoes';

/** Endereços das rotas `notifications.*` (prefixo `/notificacoes`). */
export const notificationUrls = {
    index: base,
    readAll: `${base}/ler-todas`,
    read: (id: string) => `${base}/${encodeURIComponent(id)}/ler`,
};

export function notificationBreadcrumb() {
    return resourceBreadcrumb({
        collection: { label: 'Notificações', href: notificationUrls.index },
    });
}
