import type { WebsiteHomeProps } from '@/components/Website/Public/WebsitePublic.types';
import SiteLayout from '@/components/Website/SiteLayout/SiteLayout';
import SiteSections from '@/components/Website/SiteSections/SiteSections';

export default function WebsitePublicHomePage({
    site,
    sections,
    content,
    seo,
}: WebsiteHomeProps): React.JSX.Element {
    return (
        <SiteLayout site={site} current="home" seo={seo}>
            <SiteSections sections={sections} site={site} content={content} />
        </SiteLayout>
    );
}
