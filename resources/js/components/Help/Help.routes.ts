import type { PageBreadcrumbItem } from '@/components/Navigation/PageBreadcrumb/PageBreadcrumb';
import { resourceBreadcrumb } from '@/components/Navigation/PageBreadcrumb/resourceBreadcrumb';

const base = '/ajuda';

/** Endereços das rotas `help.*` (prefixo `/ajuda`). */
export const helpUrls = {
    index: base,
    show: (slug: string, anchor?: string | null) => `${base}/${slug}${anchor ? `#${anchor}` : ''}`,
};

export function helpBreadcrumb(options: { article?: string } = {}): PageBreadcrumbItem[] {
    return resourceBreadcrumb({
        collection: { label: 'Ajuda', href: helpUrls.index },
        current: options.article,
    });
}
