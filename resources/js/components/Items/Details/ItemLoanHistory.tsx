import { useMemo } from 'react';
import FormSection from '@/components/Forms/FormSection/FormSection';
import { loanUrls } from '@/components/Loans/Loans.routes';
import type { LoanRecord } from '@/components/Loans/Loans.types';
import { studentUrls } from '@/components/Students/Students.routes';
import {
    TableListRowActions,
    TableListScroll,
    TableListTable,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { ITEM_TOUR_TARGETS } from '../itemTours';

interface ItemLoanHistoryProps {
    loans: LoanRecord[];
    canViewLoan: boolean;
    canViewStudent: boolean;
}

function beneficiary(loan: LoanRecord, canViewStudent: boolean): React.ReactNode {
    if (loan.student) {
        return canViewStudent ? (
            <a href={studentUrls.show(loan.student.id)}>{loan.student.name}</a>
        ) : (
            loan.student.name
        );
    }

    return loan.professional?.name ?? 'Não informado';
}

function loanHistoryColumns(
    canViewLoan: boolean,
    canViewStudent: boolean,
): TableListColumn<LoanRecord>[] {
    return [
        {
            id: 'beneficiary',
            label: 'Beneficiário',
            width: '28%',
            fixed: 'start',
            render: (loan) => beneficiary(loan, canViewStudent),
        },
        {
            id: 'kind',
            label: 'Vínculo',
            width: '12%',
            render: (loan) => (loan.student ? 'Aluno' : 'Profissional'),
        },
        { id: 'departure', label: 'Saída', width: '15%', render: (loan) => loan.loan_date_label },
        { id: 'due', label: 'Prazo', width: '12%', render: (loan) => loan.due_date_label },
        {
            id: 'return',
            label: 'Devolução',
            width: '15%',
            render: (loan) => loan.return_date_label ?? 'Não devolvido',
        },
        {
            id: 'status',
            label: 'Status',
            width: '18%',
            render: (loan) => <TableLabel tone={loan.status_color}>{loan.status_label}</TableLabel>,
        },
        {
            id: 'actions',
            label: 'Ações',
            width: '8%',
            fixed: 'end',
            render: (loan) => (
                <TableListRowActions
                    view={
                        canViewLoan && {
                            href: loanUrls.show(loan.id),
                            label: `Visualizar empréstimo de ${loan.loan_date_label}`,
                        }
                    }
                />
            ),
        },
    ];
}

/** Quem recebeu o item emprestado, com o status de cada empréstimo. */
export default function ItemLoanHistory({
    loans,
    canViewLoan,
    canViewStudent,
}: ItemLoanHistoryProps): React.JSX.Element {
    const columns = useMemo(
        () => loanHistoryColumns(canViewLoan, canViewStudent),
        [canViewLoan, canViewStudent],
    );

    return (
        <FormSection
            id="item-loans"
            title="Histórico de Empréstimos"
            variant="inline"
            iconClass="fa fa-exchange"
            tourTarget={ITEM_TOUR_TARGETS.loanHistory}
        >
            <TableListScroll aria-label="Histórico de empréstimos">
                <TableListTable
                    columns={columns}
                    rows={loans}
                    rowKey={(loan) => loan.id}
                    summary={`${loans.length} registro(s)`}
                    emptyMessage="Nenhum empréstimo registrado para este item."
                />
            </TableListScroll>
        </FormSection>
    );
}
