import { Link } from '@inertiajs/react';
import { helpUrls } from '../Help.routes';
import type { HelpResult } from '../Help.types';

/**
 * Resultado no padrão da tela de busca do Ubold: título com link, caminho em verde e trecho com as
 * palavras pesquisadas destacadas. Sem busca, o resumo do artigo ocupa o lugar do trecho.
 */
export default function HelpResultItem({ result }: { result: HelpResult }): React.JSX.Element {
    const href = helpUrls.show(result.slug, result.section?.anchor);
    const path = ['Ajuda', result.category_label, result.title, result.section?.title]
        .filter(Boolean)
        .join(' › ');
    const description =
        result.excerpt.length > 0
            ? result.excerpt.map((part, index) =>
                  part.highlighted ? <mark key={index}>{part.text}</mark> : part.text,
              )
            : result.summary;

    return (
        <article className="helpResultItem">
            <h3 className="helpResultItem__title">
                <Link href={href}>
                    {result.title}
                    {result.section ? (
                        <span className="helpResultItem__section">: {result.section.title}</span>
                    ) : null}
                </Link>
            </h3>
            <div className="helpResultItem__path">{path}</div>
            <p className="helpResultItem__description">{description}</p>
        </article>
    );
}
