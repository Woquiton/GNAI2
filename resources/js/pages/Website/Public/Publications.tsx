import SiteLayout from '@/components/Website/SiteLayout/SiteLayout';
import SitePageHeader from '@/components/Website/SitePageHeader/SitePageHeader';
import PublicPublicationList from '@/components/Website/Public/PublicPublicationList';
import type { WebsitePublicationsProps } from '@/components/Website/Public/WebsitePublic.types';
export default function WebsitePublicPublicationsPage(
    props: WebsitePublicationsProps,
): React.JSX.Element {
    const { site, seo } = props;
    return (
        <SiteLayout site={site} current="publications" seo={seo}>
            <SitePageHeader
                eyebrow="Publicações"
                title="Notícias, eventos e comunicados"
                subtitle={
                    site.name
                        ? `Acompanhe as novidades, os eventos e os registros do ${site.name}.`
                        : 'Acompanhe as novidades, os eventos e os registros do núcleo.'
                }
                trail={[{ label: 'Publicações' }]}
            />
            <PublicPublicationList {...props} />
        </SiteLayout>
    );
}
