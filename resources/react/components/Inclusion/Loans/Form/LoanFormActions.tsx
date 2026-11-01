import FormActions from '@/components/Forms/FormActions/FormActions';
import Button from '@/components/UI/Button/Button';

interface LoanFormActionsProps {
    cancelHref: string;
    submitLabel: string;
    canSubmit: boolean;
    processing: boolean;
}

/** Rodapé fixo do cadastro e da edição: cancelar e salvar, com o status do envio. */
export default function LoanFormActions({
    cancelHref,
    submitLabel,
    canSubmit,
    processing,
}: LoanFormActionsProps): React.JSX.Element {
    return (
        <FormActions status={processing ? 'Salvando empréstimo...' : undefined}>
            <Button href={cancelHref} tone="cancel" label="Cancelar" disabled={processing} />
            {canSubmit ? (
                <Button type="submit" tone="save" label={submitLabel} disabled={processing} />
            ) : null}
        </FormActions>
    );
}
