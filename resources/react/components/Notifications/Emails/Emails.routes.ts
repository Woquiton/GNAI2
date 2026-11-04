import { resourceBreadcrumb } from '@/components/Navigation/PageBreadcrumb/resourceBreadcrumb';

export const emailUrls = {
    index: '/emails',
    show: (id: string) => `/emails/${encodeURIComponent(id)}/visualizar`,
};

export function emailBreadcrumb(current?: string) {
    return resourceBreadcrumb({
        collection: { label: 'Central de E-mails', href: emailUrls.index },
        current,
    });
}
