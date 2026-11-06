import type { HelpArticleContent } from '../Help.types';
import HelpArticleAside from './HelpArticleAside';
import HelpArticleBody from './HelpArticleBody';
import '@styles/components/Help/Details/HelpArticle.css';

/** Artigo e, ao lado em telas largas, o índice das seções e os artigos relacionados. */
export default function HelpArticleView({
    article,
}: {
    article: HelpArticleContent;
}): React.JSX.Element {
    return (
        <div className="helpArticle">
            <HelpArticleBody slug={article.slug} html={article.html} />
            <HelpArticleAside article={article} />
        </div>
    );
}
