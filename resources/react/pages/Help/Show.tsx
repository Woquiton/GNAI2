import HelpArticleActions from '@/components/Help/Details/HelpArticleActions';
import HelpArticleView from '@/components/Help/Details/HelpArticleView';
import { helpBreadcrumb } from '@/components/Help/Help.routes';
import type { HelpShowProps } from '@/components/Help/Help.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function HelpShowPage({ article }: HelpShowProps): React.JSX.Element {
    return (
        <BusinessPage
            title={article.title}
            subtitle={article.summary}
            documentTitle={`Ajuda: ${article.title}`}
            breadcrumbItems={helpBreadcrumb({ article: article.title })}
        >
            <HelpArticleView article={article} />
            <HelpArticleActions />
        </BusinessPage>
    );
}
