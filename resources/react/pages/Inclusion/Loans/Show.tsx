import LoanDetailsCard from '@/components/Inclusion/Loans/Details/LoanDetailsCard';
import LoanDetailsActions from '@/components/Inclusion/Loans/Details/LoanDetailsActions';
import LoanOverdueNotice from '@/components/Inclusion/Loans/Details/LoanOverdueNotice';
import LoanReturnModal from '@/components/Inclusion/Loans/Details/LoanReturnModal';
import LoanDeleteModal from '@/components/Inclusion/Loans/LoanDeleteModal';
import { loanBreadcrumb, loanUrls } from '@/components/Inclusion/Loans/Loans.routes';
import type { LoanRecord, LoanShowProps } from '@/components/Inclusion/Loans/Loans.types';
import { loanShowTour } from '@/components/Inclusion/Loans/loanTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function InclusionLoansShowPage({ loan, can }: LoanShowProps): React.JSX.Element {
    const removal = useConfirmedAction<LoanRecord>({
        failureText: 'Não foi possível excluir o empréstimo. Tente novamente.',
    });
    const returning = useConfirmedAction<LoanRecord>({
        failureText: 'Não foi possível registrar a devolução. Tente novamente.',
    });
    const processing = removal.processing || returning.processing;

    return (
        <BusinessPage
            title="Detalhes do Empréstimo"
            subtitle="Visualize as informações, os prazos e o histórico do recurso."
            documentTitle={`Empréstimo #${loan.id}`}
            tour={loanShowTour}
            breadcrumbItems={loanBreadcrumb({ loan })}
            busy={processing}
        >
            {loan.is_overdue ? <LoanOverdueNotice loan={loan} /> : null}
            <LoanDetailsCard loan={loan} links={{ item: can.viewItem, student: can.viewStudent }} />
            <LoanDetailsActions
                loan={loan}
                permissions={can}
                processing={processing}
                onReturn={() => returning.open(loan)}
                onDelete={() => removal.open(loan)}
            />
            <LoanReturnModal
                open={returning.target !== null}
                processing={returning.processing}
                onClose={returning.close}
                onConfirm={(damaged) =>
                    returning.submit('patch', loanUrls.return(loan.id), { is_damaged: damaged })
                }
            />
            <LoanDeleteModal
                loan={removal.target}
                processing={removal.processing}
                onClose={removal.close}
                onConfirm={() => removal.submit('delete', loanUrls.destroy(loan.id))}
            />
        </BusinessPage>
    );
}
