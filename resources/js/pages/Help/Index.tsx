import { helpBreadcrumb, helpUrls } from '@/components/Help/Help.routes';
import type { HelpIndexProps } from '@/components/Help/Help.types';
import HelpResults from '@/components/Help/List/HelpResults';
import HelpSearch from '@/components/Help/List/HelpSearch';
import { helpIndexTour } from '@/components/Help/helpTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import { useTableListFilters } from '@/components/Tables/TableList/useTableListFilters';
import CardBox from '@/components/UI/CardBox/CardBox';

const EMPTY_FILTERS = { busca: '' };

export default function HelpIndexPage({
    filters,
    results,
    approximate,
    categories,
}: HelpIndexProps): React.JSX.Element {
    const search = useTableListFilters({
        url: helpUrls.index,
        initialFilters: filters,
        emptyFilters: EMPTY_FILTERS,
        failureText: 'Não foi possível pesquisar na Central de Ajuda. Tente novamente.',
    });

    return (
        <BusinessPage
            title="Central de Ajuda"
            subtitle="Pesquise como usar cada funcionalidade do Gnai: o que ela faz, do que depende e o passo a passo."
            breadcrumbItems={helpBreadcrumb()}
            busy={search.loading}
            tour={helpIndexTour}
        >
            <CardBox>
                <HelpSearch
                    value={search.values.busca}
                    loading={search.loading}
                    onChange={(value) => search.update('busca', value)}
                    onSubmit={search.submit}
                />
                <HelpResults
                    results={results}
                    categories={categories}
                    search={filters.busca.trim()}
                    approximate={approximate}
                />
            </CardBox>
        </BusinessPage>
    );
}
