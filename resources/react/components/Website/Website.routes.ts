import type { PageBreadcrumbItem } from '@/components/Navigation/PageBreadcrumb/PageBreadcrumb';
import { DASHBOARD_BREADCRUMB } from '@/components/Navigation/PageBreadcrumb/resourceBreadcrumb';

/** Endereços do site público (`routes/modules/website.php`, prefixo `/site`). */
export const websiteRoutes = {
    home: '/site',
    team: '/site/equipe',
    publications: '/site/publicacoes',
} as const;

/** Endereço público de uma publicação pelo slug. */
export function publicationPath(slug: string): string {
    return `${websiteRoutes.publications}/${slug}`;
}

/** Retaguarda do site (prefixo `/administracao-do-site`, rotas `builder.*`). */
export const websiteAdminRoutes = {
    builder: '/administracao-do-site/construtor',
} as const;

/** Breadcrumb do construtor (`/administracao-do-site/construtor`): Home › Site › Página inicial. */
export function websiteBuilderBreadcrumb(): PageBreadcrumbItem[] {
    return [DASHBOARD_BREADCRUMB, { label: 'Site' }, { label: 'Página inicial' }];
}
