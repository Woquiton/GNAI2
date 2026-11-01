import TeamMemberCard from '@/components/Website/TeamMemberCard/TeamMemberCard';
import type { WebsiteTeamProps } from './WebsitePublic.types';
import './WebsitePublic.css';

/** Integrantes da equipe na página pública, com mensagem enquanto não houver cadastro. */
export default function PublicTeamList({
    members,
}: Pick<WebsiteTeamProps, 'members'>): React.JSX.Element {
    return (
        <section className="websitePublic__section" aria-label="Integrantes da equipe">
            <div className="siteLayout__container">
                {members.length ? (
                    <ul className="websitePublic__teamGrid">
                        {members.map((member) => (
                            <li key={member.id}>
                                <TeamMemberCard member={member} headingLevel={2} />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="websitePublic__empty">Em breve apresentaremos nossa equipe.</p>
                )}
            </div>
        </section>
    );
}
