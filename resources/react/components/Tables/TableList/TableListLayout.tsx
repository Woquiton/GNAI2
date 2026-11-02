import type { ReactNode } from 'react';
import BusinessPage, { type BusinessPageProps } from '@/components/Navigation/BusinessPage/BusinessPage';
import { TableListCard, TableListCreateButton } from './TableListControls';

interface TableListLayoutProps extends Omit<BusinessPageProps, 'actions' | 'children'> {
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
    ...pageProps
}: TableListLayoutProps): React.JSX.Element {
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
        <BusinessPage {...pageProps} actions={headerActions}>
            <TableListCard aria-label={listLabel} loading={loading} loadingLabel={loadingLabel}>
                {filters}
                {children}
            </TableListCard>
            {dialogs}
        </BusinessPage>
    );
}
