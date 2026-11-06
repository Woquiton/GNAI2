import type { PageBreadcrumbItem } from '@/components/Navigation/PageBreadcrumb/PageBreadcrumb';

const base = '/autenticacao/painel';

/** Endereços do painel (`/autenticacao/painel`) e do endpoint JSON das atividades recentes. */
export const dashboardUrls = {
    index: base,
    activityFeed: `${base}/atividades`,
};

/** Destinos dos indicadores do painel, já com os filtros correspondentes das listagens. */
export const dashboardLinks = {
    students: `/alunos`,
    professionals: `/profissionais`,
    finishedPeis: `/peis?is_finished=1`,
    sessions: `/agendamentos`,
    pendingPendencies: `/pendencias?is_completed=0`,
    assistiveTechnologies: `/itens?item_type=assistive_technology`,
    accessibleMaterials: `/itens?item_type=accessible_educational_material`,
    loans: `/emprestimos`,
    waitlist: `/fila-de-espera`,
};

/** O painel é a própria Home: o breadcrumb tem somente o nível atual. */
export function dashboardBreadcrumb(): PageBreadcrumbItem[] {
    return [{ label: 'Painel' }];
}
