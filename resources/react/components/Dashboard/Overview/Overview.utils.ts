import { dashboardLinks } from '../Dashboard.routes';
import type { OverviewProps, OverviewSharedProps, OverviewStat } from './Overview.types';

type SupportSummary = OverviewProps['specializedEducationalSupport'];
type RadarSummary = OverviewProps['inclusiveRadar'];

/** Saudação do subtítulo com o nome (ou e-mail) do usuário autenticado. */
export function overviewWelcome(user: OverviewSharedProps['auth']['user']): string {
    return `Bem-vindo(a) ao Gnai${user ? `, ${user.name || user.email}` : ''}.`;
}

/** Percentual inteiro de PEIs finalizados; zero quando não há PEI cadastrado. */
export function finishedPeisPercentage(support: SupportSummary): number {
    return support.totalPeis
        ? Math.round((support.totalPeisFinished / support.totalPeis) * 100)
        : 0;
}

export function supportStats(support: SupportSummary): OverviewStat[] {
    return [
        {
            title: 'Alunos',
            value: support.totalStudents,
            href: dashboardLinks.students,
            icon: 'users',
            tone: 'info',
        },
        {
            title: 'Equipe',
            value: support.totalProfessionals,
            href: dashboardLinks.professionals,
            icon: 'user-md',
            tone: 'purple',
        },
        {
            title: 'PEIs finalizados',
            value: support.totalPeisFinished,
            href: dashboardLinks.finishedPeis,
            icon: 'check-square-o',
            tone: 'success',
        },
        {
            title: 'Agendamentos',
            value: support.totalSessions,
            href: dashboardLinks.sessions,
            icon: 'calendar',
            tone: 'info',
        },
        {
            title: 'Pendências',
            value: support.totalPendingPendencies,
            href: dashboardLinks.pendingPendencies,
            icon: 'exclamation-circle',
            tone: 'pink',
        },
        {
            title: 'Atrasadas',
            value: support.totalOverduePendencies,
            href: dashboardLinks.pendingPendencies,
            icon: 'clock-o',
            tone: 'purple',
        },
    ];
}

export function radarStats(radar: RadarSummary): OverviewStat[] {
    return [
        {
            title: 'Tecnologias assistivas',
            value: radar.totalAt,
            href: dashboardLinks.assistiveTechnologies,
            icon: 'desktop',
            tone: 'purple',
        },
        {
            title: 'Materiais pedagógicos acessíveis',
            value: radar.totalAem,
            href: dashboardLinks.accessibleMaterials,
            icon: 'book',
            tone: 'info',
        },
        {
            title: 'Empréstimos',
            value: radar.totalLoans,
            href: dashboardLinks.loans,
            icon: 'exchange',
            tone: 'success',
        },
        {
            title: 'Fila de espera: aguardando/notificados',
            value: radar.totalWaiting,
            href: dashboardLinks.waitlist,
            icon: 'hourglass-half',
            tone: 'pink',
        },
    ];
}
