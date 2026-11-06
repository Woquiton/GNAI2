import type {
    WebsiteContent,
    WebsiteSection,
    WebsiteSeo,
    WebsiteSite,
    PublicationCardData,
    PublicationDetailData,
    WebsitePaginator,
    TeamMemberData,
} from '../Website.types';

export type Filters = { q: string; type: string; tag: string };

export type WebsiteHomeProps = {
    site: WebsiteSite;
    sections: WebsiteSection[];
    content: WebsiteContent;
    seo: WebsiteSeo;
};

export type WebsiteTeamProps = {
    site: WebsiteSite;
    members: TeamMemberData[];
    seo: WebsiteSeo;
};

export type WebsitePublicationsProps = {
    site: WebsiteSite;
    publications: WebsitePaginator<PublicationCardData>;
    filters: Partial<Filters>;
    types: { value: string; label: string }[];
    tags: string[];
    seo: WebsiteSeo;
};

export type WebsitePublicationShowProps = {
    site: WebsiteSite;
    publication: PublicationDetailData;
    related: PublicationCardData[];
    seo: WebsiteSeo;
};
