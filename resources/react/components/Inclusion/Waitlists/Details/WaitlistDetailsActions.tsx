import FormActions from '@/components/Forms/FormActions/FormActions';
import Button from '@/components/UI/Button/Button';
import { waitlistUrls } from '../Waitlists.routes';
import type { WaitlistDetailsPermissions } from '../Waitlists.types';
import { WAITLIST_TOUR_TARGETS } from '../waitlistTours';

interface WaitlistDetailsActionsProps {
    waitlistId: number;
    permissions: WaitlistDetailsPermissions;
    /** A solicitação ainda está em um status que permite cancelamento. */
    cancellable: boolean;
    processing: boolean;
    onCancel: () => void;
    onDelete: () => void;
}

/** Rodapé fixo da visualização: PDF à esquerda; voltar, editar, cancelar e excluir ao centro. */
export default function WaitlistDetailsActions({
    waitlistId,
    permissions,
    cancellable,
    processing,
    onCancel,
    onDelete,
}: WaitlistDetailsActionsProps): React.JSX.Element {
    const pdfAction = permissions.pdf ? (
        <Button
            href={waitlistUrls.pdf(waitlistId)}
            target="_blank"
            rel="noopener noreferrer"
            tone="dark-red"
            leftIconClass="fa fa-file-pdf-o"
            label="PDF"
            title="Exportar solicitação em PDF"
            aria-label="Exportar solicitação em PDF"
        />
    ) : undefined;

    return (
        <FormActions secondary={pdfAction} tourTarget={WAITLIST_TOUR_TARGETS.detailsActions}>
            <Button
                href={waitlistUrls.index}
                tone="cancel"
                label="Voltar"
                title="Voltar para a fila de espera"
                aria-label="Voltar para a fila de espera"
                disabled={processing}
            />
            {permissions.edit ? (
                <Button
                    href={waitlistUrls.edit(waitlistId)}
                    tone="warning"
                    leftIconClass="fa fa-pencil"
                    label="Editar"
                    title="Editar solicitação"
                    aria-label="Editar solicitação"
                    disabled={processing}
                />
            ) : null}
            {permissions.cancel && cancellable ? (
                <Button
                    tone="danger"
                    leftIconClass="fa fa-ban"
                    label="Cancelar solicitação"
                    title="Cancelar solicitação"
                    aria-label="Cancelar solicitação"
                    disabled={processing}
                    onClick={onCancel}
                />
            ) : null}
            {permissions.destroy ? (
                <Button
                    tone="dark-red"
                    leftIconClass="fa fa-trash-o"
                    label="Excluir"
                    title="Excluir solicitação"
                    aria-label="Excluir solicitação"
                    disabled={processing}
                    onClick={onDelete}
                />
            ) : null}
        </FormActions>
    );
}
