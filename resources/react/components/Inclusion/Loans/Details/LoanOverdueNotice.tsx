import InlineAlert from '@/components/UI/InlineAlert/InlineAlert';
import type { LoanRecord } from '../Loans.types';
import './LoanOverdueNotice.css';

/** Aviso persistente da visualização quando a devolução está atrasada. */
export default function LoanOverdueNotice({
    loan,
}: {
    loan: Pick<LoanRecord, 'due_date' | 'due_date_label'>;
}): React.JSX.Element {
    return (
        <InlineAlert variant="warning" className="loanOverdueNotice">
            <i className="fa fa-exclamation-triangle loanOverdueNotice__icon" aria-hidden="true" />
            <div className="loanOverdueNotice__content">
                <strong>Este item está com a devolução atrasada.</strong>
                <p>
                    O prazo encerrou em{' '}
                    <time dateTime={loan.due_date ?? undefined}>{loan.due_date_label}</time>.
                </p>
            </div>
        </InlineAlert>
    );
}
