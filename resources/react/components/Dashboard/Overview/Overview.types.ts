export interface Metric {
    label: string;
    count: number;
    color?: string;
}
/** Agendamentos de um mês (`AAAA-MM`) por status. */
export interface SessionMonth {
    month: string;
    completed: number;
    cancelled: number;
    scheduled: number;
}
export interface Barrier {
    id: number;
    name: string;
    lat: number | null;
    lng: number | null;
    status: string;
    status_label: string;
    blocks_map: boolean;
    category_name: string;
    color: string;
    url: string;
}
export interface ActivityFeedItem {
    id: number;
    sentence: string;
    href: string | null;
    createdAt: string | null;
}
export interface ActivityFeedPage {
    items: ActivityFeedItem[];
    nextPage: number | null;
}
export interface ActivityFeedProps extends ActivityFeedPage {
    modelOptions: Array<{ value: string; label: string }>;
}
export interface OverviewProps {
    specializedEducationalSupport: {
        totalStudents: number;
        totalProfessionals: number;
        totalPeisFinished: number;
        totalPeisNotFinished: number;
        totalPeis: number;
        totalSessions: number;
        totalPendingPendencies: number;
        totalOverduePendencies: number;
        pendenciesByPriority: Metric[];
        sessionsByStatus: Metric[];
        sessionsByMonth: SessionMonth[];
    };
    inclusiveRadar: {
        totalAt: number;
        totalAem: number;
        totalLoans: number;
        totalWaiting: number;
        totalBarriers: number;
        barrierStatusCounts: Metric[];
        mapBarriers: Barrier[];
    };
    activityFeed: ActivityFeedProps;
}

/** Tons aceitos pelo `StatWidgetCard`. */
export type OverviewStatTone = 'info' | 'pink' | 'purple' | 'success';

/** Indicador clicável do painel, que leva à listagem filtrada correspondente. */
export interface OverviewStat {
    title: string;
    value: number;
    href: string;
    /** Nome do ícone Font Awesome, sem o prefixo `fa-`. */
    icon: string;
    tone: OverviewStatTone;
}

/** Usuário compartilhado pelo `HandleInertiaRequests`, usado na saudação do painel. */
export interface OverviewSharedProps {
    auth: { user: { name?: string; email: string } | null };
    [key: string]: unknown;
}
