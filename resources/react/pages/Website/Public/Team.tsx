import PublicTeamList from '@/components/Website/Public/PublicTeamList';
import type { WebsiteTeamProps } from '@/components/Website/Public/WebsitePublic.types';
import SiteLayout from '@/components/Website/SiteLayout/SiteLayout';
import SitePageHeader from '@/components/Website/SitePageHeader/SitePageHeader';

export default function WebsitePublicTeamPage({
    site,
    members,
    seo,
}: WebsiteTeamProps): React.JSX.Element {
    return (
        <SiteLayout site={site} current="team" seo={seo}>
            <SitePageHeader
                eyebrow="Equipe"
                title="Nossa equipe"
                subtitle={`Conheça as pessoas que fazem o ${site.name} acontecer no dia a dia.`}
                trail={[{ label: 'Equipe' }]}
            />
            <PublicTeamList members={members} />
        </SiteLayout>
    );
}
