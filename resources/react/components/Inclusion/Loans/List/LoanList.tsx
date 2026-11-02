import { useMemo } from 'react';
import {
    TableListFooter,
    TableListRowActions,
    TableListScroll,
    TableListTable,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import { loanUrls } from '../Loans.routes';
import type { LoanListPermissions, LoanPaginator, LoanRecord } from '../Loans.types';
import { loanColumns } from './loanColumns';
import './LoanList.css';

interface LoanListProps {
    loans: LoanPaginator;
    permissions: LoanListPermissions;
    loading: boolean;
    processing: boolean;
    onDelete: (loan: LoanRecord) => void;
    onPageSelect: (page: number) => void;
}

export default function LoanList({
    loans,
    permissions,
    loading,
    processing,
    onDelete,
    onPageSelect,
}: LoanListProps): React.JSX.Element {
    const columns = useMemo<TableListColumn<LoanRecord>[]>(
        () => [
            ...loanColumns,
            {
                id: 'actions',
                label: 'Ações',
                width: '12%',
                fixed: 'end',
                render: (loan) => (
                    <TableListRowActions
                        view={
                            permissions.show && {
                                href: loanUrls.show(loan.id),
                                label: `Visualizar empréstimo de ${loan.loanable.name}`,
                            }
                        }
                        remove={
                            permissions.destroy && {
                                label: `Excluir empréstimo de ${loan.loanable.name}`,
                                disabled: processing,
                                onClick: () => onDelete(loan),
                            }
                        }
                    />
                ),
            },
        ],
        [permissions.show, permissions.destroy, processing, onDelete],
    );

    return (
        <>
            <TableListScroll aria-label="Tabela de empréstimos">
                <TableListTable
                    className="loanList"
                    columns={columns}
                    rows={loans.data}
                    rowKey={(loan) => loan.id}
                    page={loans}
                    emptyMessage="Nenhum empréstimo registrado."
                />
            </TableListScroll>
            <TableListFooter
                page={loans}
                disabled={loading}
                paginationLabel="Páginas da listagem de empréstimos"
                onSelect={onPageSelect}
            />
        </>
    );
}
