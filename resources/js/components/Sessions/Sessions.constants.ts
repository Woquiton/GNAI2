import type {
    SessionStudentFilterValues,
    SessionView,
    SessionWorkspaceFilterValues,
} from './Sessions.types';

/** Valores de `attendance_type` e `type` aceitos por `Create/UpdateSessionData`. */
export const PEDAGOGICAL_ATTENDANCE = 'pedagogical';
export const GROUP_SESSION = 'group';
export const INDIVIDUAL_SESSION = 'individual';

export const sessionDeleteFailureText = 'Não foi possível excluir o agendamento. Tente novamente.';
export const sessionCancelFailureText = 'Não foi possível cancelar o agendamento. Tente novamente.';
export const sessionSaveFailureText =
    'Não foi possível salvar o agendamento. Atualize a página e tente novamente.';
export const sessionIndexFailureText =
    'Não foi possível atualizar os agendamentos. Tente novamente.';
export const mySessionsFailureText =
    'Não foi possível atualizar seus agendamentos. Tente novamente.';
export const studentSessionsFailureText =
    'Não foi possível atualizar os agendamentos do aluno. Tente novamente.';

/** Abas da central e de "Meus agendamentos" (parâmetro `view`). */
export const sessionViews: ReadonlyArray<{ key: SessionView; label: string; iconClass: string }> = [
    { key: 'calendar', label: 'Calendário', iconClass: 'fa fa-calendar' },
    { key: 'list', label: 'Listagem', iconClass: 'fa fa-list' },
];

export const emptySessionStudentFilters: SessionStudentFilterValues = {
    professional: '',
    type: '',
    status: '',
};

/** Data local no formato do backend (`AAAA-MM-DD`). */
export function localDate(date: Date = new Date()): string {
    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
    ].join('-');
}

/** Limpar os filtros volta o dia de referência para hoje. */
export function emptySessionWorkspaceFilters(): SessionWorkspaceFilterValues {
    return {
        week: localDate(),
        student: '',
        professional: '',
        type: '',
        status: '',
    };
}

export function pickSessionWorkspaceFilters(
    filters: SessionWorkspaceFilterValues,
): SessionWorkspaceFilterValues {
    return {
        week: filters.week,
        student: filters.student,
        professional: filters.professional,
        type: filters.type,
        status: filters.status,
    };
}

export function pickSessionStudentFilters(
    filters: SessionStudentFilterValues,
): SessionStudentFilterValues {
    return {
        professional: filters.professional ?? '',
        type: filters.type ?? '',
        status: filters.status ?? '',
    };
}
