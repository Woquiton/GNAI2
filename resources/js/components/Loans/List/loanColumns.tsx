import { formatTableListText, type TableListColumn } from '@/components/Tables/TableList/TableList';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { loanUrls } from '../Loans.routes';
import type { LoanRecord } from '../Loans.types';
import EmailDeliveryIndicator from '@/components/UI/EmailDeliveryIndicator/EmailDeliveryIndicator';

const NOT_INFORMED = 'Não informado';

function beneficiaryRegistration(loan: LoanRecord): string {
    return loan.student?.registration || loan.professional?.registration || NOT_INFORMED;
}

/** Colunas da listagem; as complementares começam ocultas no seletor de colunas. */
export const loanColumns: TableListColumn<LoanRecord>[] = [
    {
        id: 'confirmation-email',
        label: 'E-mail',
        hideLabel: true,
        width: '4.5%',
        fixed: 'start',
        cellTitle: (loan) => [
            `Empréstimo: ${loan.confirmation_email.label}`,
            ...(loan.return_email ? [`Devolução: ${loan.return_email.label}`] : []),
        ].join(' | '),
        render: (loan) => (
            <div className="loanList__emailIndicators">
                <EmailDeliveryIndicator
                    email={loan.confirmation_email}
                    label={`Confirmação do empréstimo #${loan.id}`}
                />
                {loan.return_email ? (
                    <EmailDeliveryIndicator
                        email={loan.return_email}
                        label={`Confirmação da devolução do empréstimo #${loan.id}`}
                    />
                ) : null}
            </div>
        ),
    },
    {
        id: 'origin-semester',
        label: 'Semestre de origem',
        defaultVisible: false,
        render: (loan) => loan.semester_label ?? 'Sem vínculo: revisar calendário',
    },
    {
        id: 'item',
        label: 'Item',
        width: '21.5%',
        render: (loan) => (
            <a href={loanUrls.item(loan.loanable_id)} target="_blank" rel="noreferrer">
                {loan.loanable.name}
            </a>
        ),
    },
    {
        id: 'beneficiary',
        label: 'Beneficiário',
        width: '20%',
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
