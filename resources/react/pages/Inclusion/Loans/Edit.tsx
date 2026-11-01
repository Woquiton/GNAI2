import LoanEditForm from '@/components/Inclusion/Loans/Form/LoanEditForm';
import { loanBreadcrumb } from '@/components/Inclusion/Loans/Loans.routes';
import type { LoanEditProps } from '@/components/Inclusion/Loans/Loans.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionLoansEditPage({
    display: loan,
    can,
}: LoanEditProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Editar Registro de Empréstimo"
            subtitle="Atualize as observações registradas para este empréstimo."
            breadcrumbItems={loanBreadcrumb({ loan, current: 'Editar' })}
        >
            <LoanEditForm key={loan.id} loan={loan} canSubmit={can.submit} />
        </BusinessPage>
    );
}
