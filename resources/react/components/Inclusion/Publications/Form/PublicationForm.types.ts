export interface NewGalleryImage {
    key: string;
    file: File;
    alt: string;
}

/** Linha dinâmica de participante; `key` mantém a identidade ao remover linhas. */
export interface SpeakerRow {
    key: string;
    /** Profissional cadastrado; vazio quando o participante é avulso. */
    id: string;
    /** Nome digitado do participante avulso. */
    name: string;
    guest: boolean;
    participation: string;
}

export interface ExistingGalleryImage {
    id: number;
    url: string;
    alt: string;
    remove: boolean;
}

export interface PublicationFormData {
    title: string;
    slug: string;
    summary: string;
    type: string;
    tag_ids: string[];
    has_schedule: boolean;
    description: string;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    location: string;
    organizer: string;
    audience: string;
    author_id: string;
    speaker_rows: SpeakerRow[];
    link_url: string;
    link_label: string;
    cover: File | null;
    cover_alt: string;
    remove_cover: boolean;
    gallery: NewGalleryImage[];
    gallery_existing: ExistingGalleryImage[];
    is_active: boolean;
    published_at: string;
    is_featured: boolean;
    seo_title: string;
    seo_description: string;
}

export type PublicationFieldsProps = {
    data: PublicationFormData;
    errors: Record<string, string | undefined>;
    disabled: boolean;
    update: <K extends keyof PublicationFormData>(key: K, value: PublicationFormData[K]) => void;
    updateWith: (callback: (data: PublicationFormData) => PublicationFormData) => void;
};
