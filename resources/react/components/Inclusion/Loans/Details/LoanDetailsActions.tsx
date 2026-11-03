import FormActions from '@/components/Forms/FormActions/FormActions';
import Button from '@/components/UI/Button/Button';
import { LOAN_TOUR_TARGETS } from '../loanTours';
import { loanUrls } from '../Loans.routes';
import type { LoanDetailsPermissions, LoanRecord } from '../Loans.types';

interface LoanDetailsActionsProps {
    loan: Pick<LoanRecord, 'id' | 'is_active'>;
    permissions: LoanDetailsPermissions;
    processing: boolean;
    onReturn: () => void;
    onDelete: () => void;
}

/** Rodapé fixo da visualização: PDF à esquerda; voltar, editar, devolver e excluir ao centro. */
export default function LoanDetailsActions({
    loan,
    permissions,
    processing,
    onReturn,
    onDelete,
}: LoanDetailsActionsProps): React.JSX.Element {
    const pdfAction = permissions.pdf ? (
        <Button
            href={loanUrls.pdf(loan.id)}
            target="_blank"
            rel="noopener noreferrer"
            tone="dark-red"
            leftIconClass="fa fa-file-pdf-o"
            label="PDF"
            title="Exportar empréstimo em PDF"
            aria-label="Exportar empréstimo em PDF"
        />
    ) : undefined;

    return (
        <FormActions secondary={pdfAction} tourTarget={LOAN_TOUR_TARGETS.detailsActions}>
            <Button
                href={loanUrls.index}
                tone="cancel"
                label="Voltar"
                title="Voltar para empréstimos"
                aria-label="Voltar para empréstimos"
                disabled={processing}
            />
            {permissions.edit ? (
                <Button
                    href={loanUrls.edit(loan.id)}
                    tone="warning"
                    leftIconClass="fa fa-pencil"
                    label="Editar"
                    title="Editar empréstimo"
                    aria-label="Editar empréstimo"
                    disabled={processing}
                />
            ) : null}
            {permissions.return && loan.is_active ? (
                <Button
                    tone="success"
                    leftIconClass="fa fa-undo"
                    label="Devolver"
                    title="Registrar devolução"
                    aria-label="Registrar devolução"
                    disabled={processing}
                    onClick={onReturn}
                />
            ) : null}
            {permissions.destroy ? (
                <Button
                    tone="dark-red"
                    leftIconClass="fa fa-trash-o"
                    label="Excluir"
                    title="Excluir empréstimo"
                    aria-label="Excluir empréstimo"
                    disabled={processing}
                    onClick={onDelete}
                />
            ) : null}
        </FormActions>
    );
}
