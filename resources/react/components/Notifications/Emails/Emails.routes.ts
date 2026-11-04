import { resourceBreadcrumb } from '@/components/Navigation/PageBreadcrumb/resourceBreadcrumb';

export const emailUrls = {
    index: '/emails',
    show: (id: string) => `/emails/${encodeURIComponent(id)}/visualizar`,
    compose: '/emails/escrever',
    store: '/emails/salvar',
    organize: '/emails/organizar',
    sync: '/emails/sincronizar',
    draft: (id: string) => `/emails/escrever?draft=${encodeURIComponent(id)}`,
    respond: (id: string, mode: 'reply' | 'forward') =>
        `/emails/escrever?source=${encodeURIComponent(id)}&mode=${mode}`,
};

export function emailBreadcrumb(current?: string) {
    return resourceBreadcrumb({
        collection: { label: 'Inbox', href: emailUrls.index },
        current,
    });
}
