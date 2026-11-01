import { inclusionBase } from '@/components/Inclusion/Inclusion.routes';
import type { PageBreadcrumbItem } from '@/components/Navigation/PageBreadcrumb/PageBreadcrumb';

const base = '/autenticacao/painel';

/** Endereços do painel (`/autenticacao/painel`) e do endpoint JSON das atividades recentes. */
export const dashboardUrls = {
    index: base,
    activityFeed: `${base}/atividades`,
};

/** Destinos dos indicadores do painel, já com os filtros correspondentes das listagens. */
export const dashboardLinks = {
    students: `${inclusionBase}/alunos`,
    professionals: `${inclusionBase}/profissionais`,
    finishedPeis: `${inclusionBase}/peis?is_finished=1`,
    sessions: `${inclusionBase}/agendamentos`,
    pendingPendencies: `${inclusionBase}/pendencias?is_completed=0`,
    assistiveTechnologies: `${inclusionBase}/itens?item_type=assistive_technology`,
    accessibleMaterials: `${inclusionBase}/itens?item_type=accessible_educational_material`,
    loans: `${inclusionBase}/emprestimos`,
    waitlist: `${inclusionBase}/fila-de-espera`,
};

/** O painel é a própria Home: o breadcrumb tem somente o nível atual. */
export function dashboardBreadcrumb(): PageBreadcrumbItem[] {
    return [{ label: 'Painel' }];
}
