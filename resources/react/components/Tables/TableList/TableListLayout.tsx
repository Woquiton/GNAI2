import { useMemo, type ReactNode } from 'react';
import BusinessPage, {
    type BusinessPageProps,
} from '@/components/Navigation/BusinessPage/BusinessPage';
import type { GuidedTourStep } from '@/components/UI/GuidedTour/GuidedTour.types';
import { TableListCard, TableListCreateButton } from './TableListControls';
import { tableListTourSteps, type TableListTourTexts } from './tableListTour';

/** Tutorial da listagem: textos próprios da tela, passos extras e o artigo da Central de Ajuda. */
export interface TableListTourConfig extends TableListTourTexts {
    helpHref?: string;
    /** Passos da tela, exibidos depois dos passos padrão da listagem. */
    steps?: GuidedTourStep[];
}

interface TableListLayoutProps extends Omit<BusinessPageProps, 'actions' | 'children' | 'tour'> {
    /** Cadastro exibido à direita do título quando o usuário tem permissão. */
    create?: { href: string; label: string } | false;
    /** Ações adicionais ao lado de "Cadastrar". */
    actions?: ReactNode;
    /** Nome acessível do card da listagem, por exemplo "Listagem de itens". */
    listLabel: string;
    loading: boolean;
    loadingLabel: string;
    /** Barra de filtros (normalmente `TableListFilters`). */
    filters?: ReactNode;
    /** Tabela e rodapé da listagem. */
    children: ReactNode;
    /** Modais de confirmação e diálogos que pertencem à listagem. */
    dialogs?: ReactNode;
    /**
     * Tutorial ao vivo. Os passos padrão (filtros, colunas, tabela e páginas) entram sozinhos;
     * use uma constante de módulo para não registrar o tutorial de novo a cada renderização.
     */
    tour?: TableListTourConfig;
}

/**
 * Composição padrão de uma tela de listagem: cabeçalho de negócio com "Cadastrar", card com
 * carregamento, filtros, tabela e paginação, seguido dos diálogos da tela.
 */
export default function TableListLayout({
    create,
    actions,
    listLabel,
    loading,
    loadingLabel,
    filters,
    children,
    dialogs,
    tour,
    ...pageProps
}: TableListLayoutProps): React.JSX.Element {
    const pageTour = useMemo(
        () =>
            tour
                ? {
                      helpHref: tour.helpHref,
                      steps: [...tableListTourSteps(tour), ...(tour.steps ?? [])],
                  }
                : undefined,
        [tour],
    );
    const headerActions =
        create || actions ? (
            <>
                {actions}
                {create ? (
                    <TableListCreateButton href={create.href} ariaLabel={create.label} />
                ) : null}
            </>
        ) : undefined;

    return (
        <BusinessPage {...pageProps} actions={headerActions} tour={pageTour}>
            <TableListCard aria-label={listLabel} loading={loading} loadingLabel={loadingLabel}>
                {filters}
                {children}
            </TableListCard>
            {dialogs}
        </BusinessPage>
    );
}
