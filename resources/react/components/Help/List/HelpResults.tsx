import Tabs, { type TabItem } from '@/components/Navigation/Tabs/Tabs';
import Badge from '@/components/UI/Badge/Badge';
import EmptyText from '@/components/UI/EmptyText/EmptyText';
import type { HelpCategoryTab, HelpResult } from '../Help.types';
import { HELP_TOUR_TARGETS } from '../helpTours';
import HelpResultItem from './HelpResultItem';
import './HelpResults.css';

interface HelpResultsProps {
    results: HelpResult[];
    categories: HelpCategoryTab[];
    search: string;
    approximate: boolean;
}

function resultList(results: HelpResult[]): React.JSX.Element {
    return (
        <div className="helpResults__list" data-tour={HELP_TOUR_TARGETS.resultList}>
            {results.map((result) => (
                <HelpResultItem
                    key={`${result.slug}-${result.section?.anchor ?? ''}`}
                    result={result}
                />
            ))}
        </div>
    );
}

function tabLabel(label: string, count: number): React.JSX.Element {
    return (
        <>
            <b>{label}</b>
            <Badge variant="primary" ariaHidden>
                {count}
            </Badge>
        </>
    );
}

/** Resultados em abas: todos e uma aba por categoria encontrada, com a contagem de artigos. */
export default function HelpResults({
    results,
    categories,
    search,
    approximate,
}: HelpResultsProps): React.JSX.Element {
    const heading = search
        ? `Resultados da busca por “${search}”`
        : 'Todos os artigos da Central de Ajuda';
    const countText = results.length === 1 ? '1 artigo' : `${results.length} artigos`;

    if (results.length === 0) {
        return (
            <div className="helpResults">
                <h2 className="helpResults__heading">{heading}</h2>
                <EmptyText className="helpResults__empty" role="status">
                    {search
                        ? 'Nenhum artigo encontrado. Tente outras palavras, como o nome do menu ou da ação.'
                        : 'Ainda não há artigos disponíveis para o seu perfil de acesso.'}
                </EmptyText>
            </div>
        );
    }

    const tabs: TabItem[] = [
        {
            id: 'all',
            accessibleLabel: `Todos os resultados, ${countText}`,
            label: tabLabel('Todos', results.length),
            icon: 'ti-search',
            content: resultList(results),
        },
        ...categories.map((category, index) => ({
            id: category.id,
            tourTarget: index === 0 ? HELP_TOUR_TARGETS.categoryTab : undefined,
            accessibleLabel: `${category.label}, ${category.count === 1 ? '1 artigo' : `${category.count} artigos`}`,
            label: tabLabel(category.label, category.count),
            icon: category.icon_class,
            content: resultList(results.filter((result) => result.category === category.id)),
        })),
    ];

    return (
        <div className="helpResults">
            <h2 className="helpResults__heading">{heading}</h2>
            <p className="helpResults__summary" role="status">
                {approximate
                    ? `Nenhum artigo tem todas as palavras pesquisadas. Mostrando ${countText} com parte delas.`
                    : `${countText} encontrado${results.length === 1 ? '' : 's'}.`}
            </p>
            <Tabs items={tabs} variant="bootstrap" tourTarget={HELP_TOUR_TARGETS.resultTabs} />
        </div>
    );
}
