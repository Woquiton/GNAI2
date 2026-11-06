import type { ScheduleStatus, PublicationFilters } from './Publications.types';

export const scheduleStatusLabels: Record<ScheduleStatus, string> = {
    upcoming: 'Em breve',
    ongoing: 'Acontecendo',
    finished: 'Encerrado',
};

export const emptyPublicationFilters: PublicationFilters = { title: '', is_active: '', type: '' };
