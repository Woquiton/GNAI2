import PublicPublicationByline from '@/components/Website/Public/PublicPublicationByline';
import PublicPublicationDetails from '@/components/Website/Public/PublicPublicationDetails';
import type { WebsitePublicationShowProps } from '@/components/Website/Public/WebsitePublic.types';
import SiteLayout from '@/components/Website/SiteLayout/SiteLayout';
import SitePageHeader from '@/components/Website/SitePageHeader/SitePageHeader';
import { websiteRoutes } from '@/components/Website/Website.routes';

export default function WebsitePublicPublicationShowPage({
    site,
    publication,
    related,
    seo,
}: WebsitePublicationShowProps): React.JSX.Element {
    return (
        <SiteLayout site={site} current="publications" seo={seo}>
            <SitePageHeader
                eyebrow={publication.type_label}
                title={publication.title}
                subtitle={publication.summary}
                trail={[
                    { label: 'Publicações', href: websiteRoutes.publications },
                    { label: publication.type_label },
                ]}
            >
                <PublicPublicationByline publication={publication} />
            </SitePageHeader>
            <PublicPublicationDetails
                site={site}
                publication={publication}
                related={related}
                seo={seo}
            />
        </SiteLayout>
    );
}
