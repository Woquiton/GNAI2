import LoanEditForm from '@/components/Loans/Form/LoanEditForm';
import { loanBreadcrumb } from '@/components/Loans/Loans.routes';
import type { LoanEditProps } from '@/components/Loans/Loans.types';
import { loanEditTour } from '@/components/Loans/loanTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function LoansEditPage({
    display: loan,
    can,
}: LoanEditProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Editar Registro de Empréstimo"
            subtitle="Atualize as observações registradas para este empréstimo."
            tour={loanEditTour}
            breadcrumbItems={loanBreadcrumb({ loan, current: 'Editar' })}
        >
            <LoanEditForm key={loan.id} loan={loan} canSubmit={can.submit} />
        </BusinessPage>
    );
}
