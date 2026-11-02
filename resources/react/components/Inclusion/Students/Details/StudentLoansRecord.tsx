import FormSection from '@/components/Forms/FormSection/FormSection';
import { loanUrls } from '@/components/Inclusion/Loans/Loans.routes';
import type { LoanRecord } from '@/components/Inclusion/Loans/Loans.types';
import type { TabItem } from '@/components/Navigation/Tabs/Tabs';
import {
    TableListCreateButton,
    TableListRowActions,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import StudentRecordTable from '../StudentRecordTable';
import type { Permissions, StudentRecord } from '../Students.types';

interface StudentLoansTabsProps {
    student: StudentRecord;
    permissions: Permissions;
    loans: LoanRecord[];
}

function loanColumns(permissions: Permissions): TableListColumn<LoanRecord>[] {
    return [
        {
            id: 'item',
            label: 'Item',
            width: '28%',
            fixed: 'start',
            render: (loan) => <strong>{loan.loanable.name}</strong>,
        },
        {
            id: 'type',
            label: 'Tipo do item',
            width: '18%',
            render: (loan) => loan.item_type_label,
        },
        {
            id: 'departure',
            label: 'Saída',
            width: '14%',
            render: (loan) => loan.loan_date_label,
        },
        {
            id: 'due',
            label: 'Prazo',
            width: '12%',
            render: (loan) => loan.due_date_label,
        },
        {
            id: 'status',
            label: 'Status',
            width: '18%',
            render: (loan) => (
                <TableLabel tone={loan.status_color}>{loan.status_label}</TableLabel>
            ),
        },
        {
            id: 'asset',
            label: 'Patrimônio / Tombamento',
            width: '16%',
            defaultVisible: false,
            render: (loan) => loan.loanable.asset_code || 'Não se aplica',
        },
        {
            id: 'return',
            label: 'Devolução',
            width: '16%',
            defaultVisible: false,
            render: (loan) => loan.return_date_label ?? 'Não devolvido',
        },
        {
            id: 'actions',
            label: 'Ações',
            width: '10%',
            fixed: 'end',
            render: (loan) => (
                <TableListRowActions
                    view={
                        permissions['loan.show'] && {
                            href: loanUrls.show(loan.id),
                            label: `Visualizar empréstimo de ${loan.loanable.name}`,
                        }
                    }
                />
            ),
        },
    ];
}

function StudentLoans({ student, permissions, loans }: StudentLoansTabsProps): React.JSX.Element {
    const createAction = permissions['loan.create'] ? (
        <TableListCreateButton
            href={`${loanUrls.create}?student_id=${student.id}`}
            ariaLabel="Cadastrar empréstimo para o aluno"
        />
    ) : undefined;

    return (
        <FormSection id="loans" title="Empréstimos" iconClass="fa fa-exchange" variant="inline">
            <StudentRecordTable
                ariaLabel="Empréstimos do aluno"
                columns={loanColumns(permissions)}
                rows={loans}
                rowKey={(loan) => loan.id}
                emptyMessage="Nenhum empréstimo encontrado."
                actions={createAction}
            />
        </FormSection>
    );
}

/** Aba dos empréstimos de tecnologias assistivas e materiais recebidos pelo aluno. */
export function createStudentLoanTabs(props: StudentLoansTabsProps): TabItem[] {
    if (!props.permissions['loan.index']) {
        return [];
    }

    return [
        {
            id: 'loans',
            label: 'Empréstimos',
            icon: 'fa fa-exchange',
            content: <StudentLoans {...props} />,
        },
    ];
}
