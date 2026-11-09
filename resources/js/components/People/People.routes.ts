import { resourceBreadcrumb } from '@/components/Navigation/PageBreadcrumb/resourceBreadcrumb';

export const personUrls = {
    index: '/pessoas',
    create: '/pessoas/criar',
    store: '/pessoas/salvar',
    edit: (id: number) => `/pessoas/${id}/editar`,
    update: (id: number) => `/pessoas/${id}/salvar`,
};
export const personBreadcrumb = (current?: string) =>
    resourceBreadcrumb({
        collection: { label: 'Pessoas', href: personUrls.index },
        current,
    });
