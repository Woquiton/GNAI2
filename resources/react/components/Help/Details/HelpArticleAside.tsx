import { Link } from '@inertiajs/react';
import CardBox from '@/components/UI/CardBox/CardBox';
import { helpUrls } from '../Help.routes';
import type { HelpArticleContent } from '../Help.types';
import { HELP_TOUR_TARGETS } from '../helpTours';

/** Índice das seções do artigo e os demais artigos da mesma categoria. */
export default function HelpArticleAside({
    article,
}: {
    article: HelpArticleContent;
}): React.JSX.Element | null {
    if (article.sections.length === 0 && article.related.length === 0) {
        return null;
    }

    return (
        <aside className="helpArticle__aside" aria-label="Navegação do artigo">
            {article.sections.length > 0 ? (
                <CardBox
                    className="helpArticle__panel"
                    tourTarget={HELP_TOUR_TARGETS.articleSections}
                >
                    <nav aria-labelledby="help-toc-title">
                        <h2 id="help-toc-title" className="helpArticle__panelTitle">
                            <i className="ti-list" aria-hidden="true" /> Nesta página
                        </h2>
                        <ol className="helpArticle__toc">
                            {article.sections.map((section) => (
                                <li key={section.anchor}>
                                    <a href={`#${section.anchor}`}>{section.title}</a>
                                </li>
                            ))}
                        </ol>
                    </nav>
                </CardBox>
            ) : null}
            {article.related.length > 0 ? (
                <CardBox
                    className="helpArticle__panel"
                    tourTarget={HELP_TOUR_TARGETS.articleRelated}
                >
                    <h2 className="helpArticle__panelTitle">
                        <i className="ti-book" aria-hidden="true" /> Mais em{' '}
                        {article.category_label}
                    </h2>
                    <ul className="helpArticle__related">
                        {article.related.map((related) => (
                            <li key={related.slug}>
                                <Link href={helpUrls.show(related.slug)}>{related.title}</Link>
                                {related.summary ? <p>{related.summary}</p> : null}
                            </li>
                        ))}
                    </ul>
                </CardBox>
            ) : null}
        </aside>
    );
}
