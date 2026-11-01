import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import type { LoanRecord } from '../Loans.types';

const NOT_APPLICABLE = 'Não se aplica';

interface LoanDetailsProps {
    loan: LoanRecord;
    /** A edição apresenta as observações no campo editável, e não como leitura. */
    showObservation?: boolean;
}

/** Recurso, beneficiário, responsável, prazos e status de um empréstimo. */
export default function LoanDetails({
    loan,
    showObservation = true,
}: LoanDetailsProps): React.JSX.Element {
    return (
        <DetailGrid>
            <DetailField label="Tipo do Item">{loan.item_type_label}</DetailField>
            <DetailField label="Recurso Emprestado">{loan.loanable.name}</DetailField>
            <DetailField label="Patrimônio / Tombamento" wide>
                {loan.loanable.asset_code || NOT_APPLICABLE}
            </DetailField>
            <DetailField label="Estudante (Beneficiário)">
                {loan.student?.name ?? NOT_APPLICABLE}
            </DetailField>
            <DetailField label="Profissional (Beneficiário)">
                {loan.professional?.name ?? NOT_APPLICABLE}
            </DetailField>
            <DetailField label="Usuário Responsável" wide>
                {loan.user.name}
            </DetailField>
            <DetailField label="Data de Saída">{loan.loan_date_label}</DetailField>
            <DetailField label="Previsão de Devolução">{loan.due_date_label}</DetailField>
            <DetailField label="Status do Empréstimo">
                <TableLabel tone={loan.status_color}>{loan.status_label}</TableLabel>
            </DetailField>
            <DetailField label="Data Real da Devolução">
                {loan.return_date_label ?? 'Não devolvido'}
            </DetailField>
            {showObservation ? (
                <DetailField label="Observações / Estado do Item" wide preserveLineBreaks>
                    {loan.observation || 'Nenhuma observação registrada.'}
                </DetailField>
            ) : null}
        </DetailGrid>
    );
}
