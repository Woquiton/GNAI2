import { useState, type HTMLAttributes, type ReactNode, type TdHTMLAttributes } from 'react';
import Pagination from '@/components/Navigation/Pagination/Pagination';
import Button from '@/components/UI/Button/Button';
import { joinClassNames } from '@/utils/joinClassNames';
import type { TableListPage } from './TableList.types';
import { formatTableListRange } from './TableList.utils';
import { TableListBusyContext } from './TableListBusyContext';
import TableListPageSize from './TableListPageSize';
import './TableList.css';

export function TableListCard({
    className,
    children,
    loading = false,
    loadingLabel = 'Atualizando listagem',
    ...props
}: HTMLAttributes<HTMLElement> & {
    loading?: boolean;
    loadingLabel?: string;
}): React.JSX.Element {
    const [busy, setBusy] = useState(false);
    const showLoading = loading || busy;

    return (
        <section
            className={joinClassNames('tableListCard', className)}
            {...props}
            aria-busy={showLoading || props['aria-busy']}
        >
            <TableListBusyContext.Provider value={setBusy}>{children}</TableListBusyContext.Provider>
            {showLoading ? (
                <div
                    className="tableListCard__loading panel-disabled"
                    role="status"
                    aria-label={loadingLabel}
                >
                    <span className="tableListCard__loader loader-1" aria-hidden="true" />
                </div>
            ) : null}
        </section>
    );
}

export function TableListCreateButton({
    href,
    ariaLabel,
}: {
    href: string;
    ariaLabel: string;
}): React.JSX.Element {
    return (
        <Button href={href} tone="create" labelIconClass="fa fa-plus" aria-label={ariaLabel}>
            Cadastrar
        </Button>
    );
}

export function TableListFilterActions({ children }: { children: ReactNode }): React.JSX.Element {
    return <div className="tableListFilterActions">{children}</div>;
}

export function TableListClearButton({
    disabled = false,
    onClick,
}: {
    disabled?: boolean;
    onClick: () => void;
}): React.JSX.Element {
    return (
        <Button
            type="button"
            tone="cancel"
            size="sm"
            iconOnly
            leftIconClass="fa fa-eraser"
            title="Limpar filtros"
            aria-label="Limpar filtros"
            className="tableListClearButton"
            disabled={disabled}
            onClick={onClick}
        />
    );
}

export function TableListScroll({
    className,
    children,
    ...props
}: HTMLAttributes<HTMLDivElement>): React.JSX.Element {
    return (
        <div role="region" className={joinClassNames('tableListScroll', className)} {...props}>
            {children}
        </div>
    );
}

/** Linha única de estado vazio no modo com `<tr>` filhos. */
export function TableListEmptyRow({
    colSpan,
    children,
}: {
    colSpan: number;
    children: ReactNode;
}): React.JSX.Element {
    return (
        <tr>
            <TableListEmpty colSpan={colSpan}>{children}</TableListEmpty>
        </tr>
    );
}

export function TableListEmpty({
    className,
    children,
    ...props
}: TdHTMLAttributes<HTMLTableCellElement>): React.JSX.Element {
    return (
        <td className={joinClassNames('tableListEmpty', className)} {...props}>
            {children}
        </td>
    );
}

/**
 * Rodapé das listagens paginadas: o intervalo ("1 a 10 de 14"), a quantidade por página e a
 * paginação vêm do mesmo paginador. A quantidade é lembrada por usuário e por tela.
 */
export function TableListFooter({
    page,
    disabled = false,
    paginationLabel,
    onSelect,
}: {
    page: TableListPage;
    disabled?: boolean;
    paginationLabel: string;
    onSelect: (page: number) => void;
}): React.JSX.Element {
    return (
        <footer className="tableListFooter">
            <div className="tableListFooter__summary">
                <span>{formatTableListRange(page)}</span>
                {page.total > 0 ? (
                    <TableListPageSize value={page.per_page} disabled={disabled} />
                ) : null}
            </div>
            <nav aria-label={paginationLabel}>
                <Pagination
                    currentPage={page.current_page}
                    pageCount={page.last_page}
                    disabled={disabled}
                    onSelect={onSelect}
                />
            </nav>
        </footer>
    );
}

export function TableListSummary({ children }: { children: ReactNode }): React.JSX.Element {
    return (
        <footer className="tableListFooter">
            <span>{children}</span>
        </footer>
    );
}
