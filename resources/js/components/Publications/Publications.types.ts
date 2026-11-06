export type ScheduleStatus = 'upcoming' | 'ongoing' | 'finished';

export interface PublicationGalleryItem {
    id: number;
    url: string;
    alt: string;
}

export interface PublicationSpeaker {
    id: number;
    professional_id: number | null;
    name: string | null;
    guest_name: string | null;
    role: string | null;
    participation: string | null;
    photo_url: string | null;
}

/** Publicação do site (antiga agenda institucional). */
export interface PublicationRecord {
    id: number;
    title: string;
    slug: string | null;
    summary: string | null;
    type: string;
    type_label: string;
    tags: { id: number; name: string }[];
    has_schedule: boolean;
    description: string | null;
    description_html?: string;
    start_date: string | null;
    end_date: string | null;
    start_date_label: string;
    end_date_label: string;
    start_time: string | null;
    end_time: string | null;
    location: string | null;
    organizer: string | null;
    audience: string | null;
    is_active: boolean;
    is_featured: boolean;
    published_at: string | null;
    published_at_label: string;
    author_id: number | null;
    author_name: string | null;
    schedule_status: ScheduleStatus | null;
    public_url: string | null;
    link_url?: string | null;
    link_label?: string | null;
    cover_url?: string | null;
    cover_alt?: string | null;
    seo_title?: string | null;
    seo_description?: string | null;
    gallery?: PublicationGalleryItem[];
    speakers?: PublicationSpeaker[];
}

export interface PublicationPaginator {
    data: PublicationRecord[];
    current_page: number;
    last_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

export interface SelectOption {
    value: string;
    label: string;
}

export interface PublicationFormOptions {
    types: SelectOption[];
    authors: SelectOption[];
    speakers: SelectOption[];
    tags: SelectOption[];
    defaultAuthorId: number | null;
    publicBaseUrl: string;
}

export type PublicationFilters = { title: string; is_active: string; type: string };
export interface PublicationListPermissions {
    create: boolean;
    show: boolean;
    destroy: boolean;
}
export interface PublicationDetailsPermissions {
    edit: boolean;
    destroy: boolean;
    pdf: boolean;
}
export interface PublicationIndexProps {
    publications: PublicationPaginator;
    filters: Partial<PublicationFilters>;
    types: SelectOption[];
    can: PublicationListPermissions;
}
export interface PublicationShowProps {
    publication: PublicationRecord;
    backRoute: string;
    can: PublicationDetailsPermissions;
}
export interface PublicationCreateProps {
    backRoute: string;
    options: PublicationFormOptions;
    can: { submit: boolean };
}
export interface PublicationEditProps {
    publication: PublicationRecord;
    options: PublicationFormOptions;
    can: { submit: boolean };
}
