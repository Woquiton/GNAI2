import LoanCreateForm from '@/components/Inclusion/Loans/Form/LoanCreateForm';
import { loanBreadcrumb } from '@/components/Inclusion/Loans/Loans.routes';
import type { LoanCreateProps } from '@/components/Inclusion/Loans/Loans.types';
import { loanCreateTour } from '@/components/Inclusion/Loans/loanTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionLoansCreatePage(props: LoanCreateProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Registrar Novo Empréstimo"
            subtitle="Vincule um recurso de acessibilidade a um beneficiário e defina os prazos de devolução."
            tour={loanCreateTour}
            breadcrumbItems={loanBreadcrumb({ current: 'Cadastrar' })}
        >
            <LoanCreateForm {...props} />
        </BusinessPage>
    );
}
