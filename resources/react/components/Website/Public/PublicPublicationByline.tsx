import type { WebsitePublicationShowProps } from './WebsitePublic.types';
import './WebsitePublic.css';

/** Data de publicação e autoria exibidas no cabeçalho da publicação. */
export default function PublicPublicationByline({
    publication,
}: Pick<WebsitePublicationShowProps, 'publication'>): React.JSX.Element {
    return (
        <p className="websitePublic__byline">
            {publication.published_at_label ? (
                <span>
                    <i className="fa fa-calendar-o" aria-hidden="true" /> Publicado em{' '}
                    <time dateTime={publication.published_at ?? undefined}>
                        {publication.published_at_label}
                    </time>
                </span>
            ) : null}
            {publication.author ? (
                <span>
                    <i className="fa fa-user" aria-hidden="true" /> Por {publication.author}
                </span>
            ) : null}
        </p>
    );
}
