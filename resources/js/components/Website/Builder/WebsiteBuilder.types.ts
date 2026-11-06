import type {
    PillarCardAppearance,
    WebsiteContent,
    WebsiteSection,
    WebsiteSectionType,
    WebsiteSite,
} from '@/components/Website/Website.types';
import type { BuilderSettings } from './websiteBuilder';
export type WebsiteBuilderProps = {
    settings: BuilderSettings;
    sections: WebsiteSection[];
    site: WebsiteSite;
    content: WebsiteContent;
    sectionTypes: { value: WebsiteSectionType; label: string }[];
    sectionTemplates: Record<WebsiteSectionType, WebsiteSection>;
    pillarCardTemplate: PillarCardAppearance;
    guidanceStepTemplate: PillarCardAppearance;
    publicUrl: string;
    can: { submit: boolean };
};
