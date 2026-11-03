import { usePage } from '@inertiajs/react';
import LoanDeleteModal from '@/components/Inclusion/Loans/LoanDeleteModal';
import { emptyLoanFilters } from '@/components/Inclusion/Loans/Loans.constants';
import { loanBreadcrumb, loanUrls } from '@/components/Inclusion/Loans/Loans.routes';
import type { LoanIndexProps, LoanRecord } from '@/components/Inclusion/Loans/Loans.types';
import LoanFilters from '@/components/Inclusion/Loans/List/LoanFilters';
import LoanList from '@/components/Inclusion/Loans/List/LoanList';
import { loanListTour } from '@/components/Inclusion/Loans/loanTours';
import { TableListLayout, useTableListFilters } from '@/components/Tables/TableList/TableList';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function InclusionLoansIndexPage({
    loans,
    filters: initialFilters,
    can,
}: LoanIndexProps): React.JSX.Element {
    const errors = usePage().props.errors as Record<string, string | undefined>;
    const filters = useTableListFilters({
        url: loanUrls.index,
        initialFilters,
        emptyFilters: emptyLoanFilters,
        failureText: 'Não foi possível atualizar os empréstimos. Tente novamente.',
    });
    const removal = useConfirmedAction<LoanRecord>({
        failureText: 'Não foi possível excluir o empréstimo. Tente novamente.',
    });

    function confirmRemoval(): void {
        if (removal.target) {
            filters.cancelScheduled();
            removal.submit('delete', loanUrls.destroy(removal.target.id));
        }
    }

    return (
        <TableListLayout
            title="Empréstimos de Recursos"
            subtitle="Controle de saídas e devoluções de tecnologias e materiais pedagógicos."
            breadcrumbItems={loanBreadcrumb()}
            tour={loanListTour}
            create={can.create && { href: loanUrls.create, label: 'Cadastrar empréstimo' }}
            listLabel="Listagem de empréstimos"
            loading={filters.loading}
            loadingLabel="Atualizando empréstimos"
            filters={
                <LoanFilters
                    values={filters.values}
                    errors={errors}
                    onUpdate={filters.update}
                    onClear={filters.clear}
                    onSubmit={filters.submit}
                />
            }
            dialogs={
                <LoanDeleteModal
                    loan={removal.target}
                    processing={removal.processing}
                    onClose={removal.close}
                    onConfirm={confirmRemoval}
                />
            }
        >
            <LoanList
                loans={loans}
                permissions={can}
                loading={filters.loading}
                processing={removal.processing}
                onDelete={removal.open}
                onPageSelect={filters.selectPage}
            />
        </TableListLayout>
    );
}
