import FormActions from '@/components/Forms/FormActions/FormActions';
import Button from '@/components/UI/Button/Button';
import { WAITLIST_TOUR_TARGETS } from '../waitlistTours';

interface WaitlistFormActionsProps {
    editing: boolean;
    cancelHref: string;
    canSubmit: boolean;
    processing: boolean;
    /** Impede o envio sem estar processando (por exemplo, editor indisponível). */
    blocked?: boolean;
}

/** Rodapé fixo do cadastro e da edição de solicitações: cancelar e salvar. */
export default function WaitlistFormActions({
    editing,
    cancelHref,
    canSubmit,
    processing,
    blocked = false,
}: WaitlistFormActionsProps): React.JSX.Element {
    const cancelLabel = editing
        ? 'Cancelar e voltar à solicitação'
        : 'Cancelar e voltar à fila de espera';
    const submitTitle = editing ? 'Salvar alterações' : 'Cadastrar solicitação';

    return (
        <FormActions
            status={processing ? 'Salvando solicitação...' : undefined}
            tourTarget={WAITLIST_TOUR_TARGETS.formActions}
        >
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
                    disabled={processing || blocked}
                />
            ) : null}
        </FormActions>
    );
}
