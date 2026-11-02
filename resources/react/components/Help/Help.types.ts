/** Parte do trecho de um resultado; as partes destacadas contêm as palavras pesquisadas. */
export interface HelpExcerptPart {
    text: string;
    highlighted: boolean;
}

export interface HelpSectionLink {
    anchor: string;
    title: string;
}

/** Artigo encontrado (ou listado, sem busca) por `HelpController@index`. */
export interface HelpResult {
    slug: string;
    title: string;
    summary: string;
    category: string;
    category_label: string;
    /** Seção que melhor atende a busca; nulo quando o artigo atende como um todo. */
    section: HelpSectionLink | null;
    excerpt: HelpExcerptPart[];
}

export interface HelpCategoryTab {
    id: string;
    label: string;
    icon_class: string;
    count: number;
}

export interface HelpIndexProps {
    filters: { busca: string };
    results: HelpResult[];
    /** Nenhum artigo tem todas as palavras; os resultados atendem só parte delas. */
    approximate: boolean;
    categories: HelpCategoryTab[];
}

export interface HelpRelatedArticle {
    slug: string;
    title: string;
    summary: string;
}

export interface HelpArticleContent {
    slug: string;
    title: string;
    summary: string;
    category: string;
    category_label: string;
    /** HTML gerado no servidor a partir do Markdown, com o HTML de entrada escapado. */
    html: string;
    sections: HelpSectionLink[];
    related: HelpRelatedArticle[];
}

export interface HelpShowProps {
    article: HelpArticleContent;
}
