import { formatTableListText, type TableListColumn } from '@/components/Tables/TableList/TableList';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { loanUrls } from '../Loans.routes';
import type { LoanRecord } from '../Loans.types';

const NOT_INFORMED = 'Não informado';

function beneficiaryRegistration(loan: LoanRecord): string {
    return loan.student?.registration || loan.professional?.registration || NOT_INFORMED;
}

/** Colunas da listagem; as complementares começam ocultas no seletor de colunas. */
export const loanColumns: TableListColumn<LoanRecord>[] = [
    {
        id: 'origin-semester',
        label: 'Semestre de origem',
        defaultVisible: false,
        render: (loan) => loan.semester_label ?? 'Sem vínculo: revisar calendário',
    },
    {
        id: 'item',
        label: 'Item',
        width: '24%',
        fixed: 'start',
        render: (loan) => (
            <a href={loanUrls.item(loan.loanable_id)} target="_blank" rel="noreferrer">
                {loan.loanable.name}
            </a>
        ),
    },
    {
        id: 'beneficiary',
        label: 'Beneficiário',
        width: '22%',
        render: (loan) => (loan.student ?? loan.professional)?.name ?? NOT_INFORMED,
    },
    {
        id: 'due',
        label: 'Prazo',
        width: '14%',
        render: (loan) =>
            loan.is_overdue ? (
                <span className="loanList__overdue">{loan.due_date_label}</span>
            ) : (
                loan.due_date_label
            ),
    },
    {
        id: 'status',
        label: 'Status',
        width: '16%',
        render: (loan) => <TableLabel tone={loan.status_color}>{loan.status_label}</TableLabel>,
    },
    { id: 'user', label: 'Usuário', width: '12%', render: (loan) => loan.user.name },
    {
        id: 'type',
        label: 'Tipo do item',
        width: '16%',
        defaultVisible: false,
        render: (loan) => loan.item_type_label,
    },
    {
        id: 'asset',
        label: 'Patrimônio / Tombamento',
        width: '16%',
        defaultVisible: false,
        render: (loan) => loan.loanable.asset_code || NOT_INFORMED,
    },
    {
        id: 'registration',
        label: 'Matrícula do beneficiário',
        width: '16%',
        defaultVisible: false,
        render: beneficiaryRegistration,
    },
    {
        id: 'departure',
        label: 'Saída',
        width: '16%',
        defaultVisible: false,
        render: (loan) => loan.loan_date_label,
    },
    {
        id: 'return',
        label: 'Devolução',
        width: '16%',
        defaultVisible: false,
        render: (loan) => loan.return_date_label || NOT_INFORMED,
    },
    {
        id: 'observation',
        label: 'Observações',
        width: '16%',
        defaultVisible: false,
        render: (loan) => formatTableListText(loan.observation),
    },
];
