import { router } from '@inertiajs/react';
import { useEffect, type MouseEvent } from 'react';
import CardBox from '@/components/UI/CardBox/CardBox';
import RichTextContent from '@/components/UI/RichTextContent/RichTextContent';
import { HELP_TOUR_TARGETS } from '../helpTours';

interface HelpArticleBodyProps {
    slug: string;
    /** HTML gerado no servidor a partir de `resources/help`, com o HTML de entrada escapado. */
    html: string;
}

/** Links internos do artigo (`/ajuda/pei`) navegam pelo Inertia; os demais seguem o navegador. */
function handleInternalLink(event: MouseEvent<HTMLDivElement>): void {
    const anchor = (event.target as HTMLElement).closest('a');
    const href = anchor?.getAttribute('href') ?? '';

    if (
        !anchor ||
        !href.startsWith('/') ||
        href.startsWith('//') ||
        anchor.target ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
    ) {
        return;
    }

    event.preventDefault();
    router.visit(href);
}

/** Corpo do artigo da Central de Ajuda. */
export default function HelpArticleBody({ slug, html }: HelpArticleBodyProps): React.JSX.Element {
    // Resultados e atalhos apontam para uma seção (#clonar-um-item); leva a ela ao abrir o artigo.
    useEffect(() => {
        const anchor = decodeURIComponent(window.location.hash.slice(1));

        if (anchor) {
            document.getElementById(anchor)?.scrollIntoView();
        }
    }, [slug]);

    return (
        <CardBox
            as="article"
            className="helpArticle__body"
            tourTarget={HELP_TOUR_TARGETS.articleBody}
        >
            {/* O clique é delegado aos links do HTML; o teclado já os aciona como links nativos. */}
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
            <div onClick={handleInternalLink}>
                <RichTextContent html={html} className="helpArticle__content" />
            </div>
        </CardBox>
    );
}
