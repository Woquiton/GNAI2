import { studentUrls } from '@/components/Inclusion/Students/Students.routes';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import RichTextContent from '@/components/UI/RichTextContent/RichTextContent';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { loanUrls } from '../Loans.routes';
import type { LoanRecord } from '../Loans.types';

const NOT_APPLICABLE = 'Não se aplica';

interface LoanDetailsProps {
    loan: LoanRecord;
    /** A edição apresenta as observações no campo editável, e não como leitura. */
    showObservation?: boolean;
    /** Transforma o recurso e o aluno em links para seus cadastros, quando permitido. */
    links?: { item: boolean; student: boolean };
}

/** Recurso, beneficiário, responsável, prazos e status de um empréstimo. */
export default function LoanDetails({
    loan,
    showObservation = true,
    links = { item: false, student: false },
}: LoanDetailsProps): React.JSX.Element {
    const { student } = loan;

    return (
        <DetailGrid>
            <DetailField label="Tipo do Item">{loan.item_type_label}</DetailField>
            <DetailField label="Recurso Emprestado">
                {links.item ? (
                    <a href={loanUrls.item(loan.loanable_id)}>{loan.loanable.name}</a>
                ) : (
                    loan.loanable.name
                )}
            </DetailField>
            <DetailField label="Patrimônio / Tombamento" wide>
                {loan.loanable.asset_code || NOT_APPLICABLE}
            </DetailField>
            <DetailField label="Estudante (Beneficiário)">
                {student && links.student ? (
                    <a href={studentUrls.show(student.id)}>{student.name}</a>
                ) : (
                    (student?.name ?? NOT_APPLICABLE)
                )}
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
                <DetailField label="Observações / Estado do Item" wide>
                    {loan.observation_html ? (
                        <RichTextContent html={loan.observation_html} />
                    ) : (
                        'Nenhuma observação registrada.'
                    )}
                </DetailField>
            ) : null}
        </DetailGrid>
    );
}
