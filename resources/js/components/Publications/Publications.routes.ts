import type { PageBreadcrumbItem } from '@/components/Navigation/PageBreadcrumb/PageBreadcrumb';
const base = '/publicacoes';
export const publicationUrls = {
    index: base,
    create: `${base}/criar`,
    store: `${base}/salvar`,
    show: (id: number) => `${base}/${id}`,
    edit: (id: number) => `${base}/${id}/editar`,
    update: (id: number) => `${base}/${id}`,
    destroy: (id: number) => `${base}/${id}`,
    pdf: (id: number) => `${base}/${id}/pdf`,
};
export function publicationBreadcrumb({
    current,
    publicationTitle,
    publicationId,
    backRoute,
}: {
    current?: string;
    publicationTitle?: string;
    publicationId?: number;
    backRoute?: string;
} = {}): PageBreadcrumbItem[] {
    const breadcrumbs: PageBreadcrumbItem[] = [
        { label: 'Home', href: '/autenticacao/painel' },
        {
            label: 'Publicações',
            href: current || publicationId ? backRoute || base : undefined,
        },
    ];

    if (publicationId) {
        breadcrumbs.push({
            label: publicationTitle || `Publicação #${publicationId}`,
            href: current ? publicationUrls.show(publicationId) : undefined,
        });
    }

    if (current) breadcrumbs.push({ label: current });

    return breadcrumbs;
}
