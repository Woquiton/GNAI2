import { resourceBreadcrumb } from '@/components/Navigation/PageBreadcrumb/resourceBreadcrumb';

const base = '/relatorios';

/** Endereços das rotas `reports.*` (prefixo `/relatorios`). */
export const reportUrls = {
    index: base,
    sources: `${base}/fontes`,
    metadata: `${base}/metadados`,
    run: `${base}/consultar`,
    pdf: `${base}/exportar/pdf`,
};

export function reportBreadcrumb() {
    return resourceBreadcrumb({ collection: { label: 'Relatórios', href: reportUrls.index } });
}
