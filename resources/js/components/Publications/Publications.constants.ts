import type { ScheduleStatus, PublicationFilters } from './Publications.types';

export const scheduleStatusLabels: Record<ScheduleStatus, string> = {
    upcoming: 'Em breve',
    ongoing: 'Acontecendo',
    finished: 'Encerrado',
};

export const emptyPublicationFilters: PublicationFilters = {
    author_name: '',
    tag_name: '',
    is_featured: '',

    created_from: '',
    created_to: '',
    title: '',
    is_active: '',
    type: '',
};
