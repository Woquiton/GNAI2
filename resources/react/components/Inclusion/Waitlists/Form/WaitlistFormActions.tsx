import FormActions from '@/components/Forms/FormActions/FormActions';
import Button from '@/components/UI/Button/Button';

interface WaitlistFormActionsProps {
    editing: boolean;
    cancelHref: string;
    canSubmit: boolean;
    processing: boolean;
}

/** Rodapé fixo do cadastro e da edição de solicitações: cancelar e salvar. */
export default function WaitlistFormActions({
    editing,
    cancelHref,
    canSubmit,
    processing,
}: WaitlistFormActionsProps): React.JSX.Element {
    const cancelLabel = editing
        ? 'Cancelar e voltar à solicitação'
        : 'Cancelar e voltar à fila de espera';
    const submitTitle = editing ? 'Salvar alterações' : 'Cadastrar solicitação';

    return (
        <FormActions status={processing ? 'Salvando solicitação...' : undefined}>
            <Button
                href={cancelHref}
                tone="cancel"
                label="Cancelar"
                title={cancelLabel}
                aria-label={cancelLabel}
                disabled={processing}
            />
            {canSubmit ? (
                <Button
                    type="submit"
                    tone="save"
                    label={editing ? 'Salvar' : 'Cadastrar'}
                    title={submitTitle}
                    aria-label={submitTitle}
                    disabled={processing}
                />
            ) : null}
        </FormActions>
    );
}
