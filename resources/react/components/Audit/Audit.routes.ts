import { resourceBreadcrumb } from '@/components/Navigation/PageBreadcrumb/resourceBreadcrumb';

/** Endereços das rotas `audit.*` (prefixo `/auditoria`). */
export const auditUrls = {
    index: '/auditoria',
};

export function auditBreadcrumb() {
    return resourceBreadcrumb({ collection: { label: 'Auditoria', href: auditUrls.index } });
}
