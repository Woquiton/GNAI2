import FormActions from '@/components/Forms/FormActions/FormActions';
import Button from '@/components/UI/Button/Button';
import { barrierUrls } from '../Barriers.routes';
import type { BarrierDetailsPermissions } from '../Barriers.types';

interface BarrierDetailsActionsProps {
    barrierId: number;
    permissions: BarrierDetailsPermissions;
    deleting: boolean;
    onDelete: () => void;
}

/** Rodapé fixo da visualização: PDF à esquerda; voltar, editar e excluir ao centro. */
export default function BarrierDetailsActions({
    barrierId,
    permissions,
    deleting,
    onDelete,
}: BarrierDetailsActionsProps): React.JSX.Element {
    const pdfAction = permissions.pdf ? (
        <Button
            href={barrierUrls.pdf(barrierId)}
            target="_blank"
            rel="noopener noreferrer"
            tone="dark-red"
            leftIconClass="fa fa-file-pdf-o"
            label="PDF"
            title="Exportar barreira em PDF"
            aria-label="Exportar barreira em PDF"
        />
    ) : undefined;

    return (
        <FormActions secondary={pdfAction}>
            <Button
                href={barrierUrls.index}
                tone="cancel"
                label="Voltar"
                title="Voltar para barreiras"
                aria-label="Voltar para barreiras"
                disabled={deleting}
            />
            {permissions.edit ? (
                <Button
                    href={barrierUrls.edit(barrierId)}
                    tone="warning"
                    leftIconClass="fa fa-pencil"
                    label="Editar"
                    title="Editar barreira"
                    aria-label="Editar barreira"
                />
            ) : null}
            {permissions.destroy ? (
                <Button
                    type="button"
                    tone="dark-red"
                    leftIconClass="fa fa-trash-o"
                    label="Excluir"
                    title="Excluir barreira"
                    aria-label="Excluir barreira"
                    disabled={deleting}
                    onClick={onDelete}
                />
            ) : null}
        </FormActions>
    );
}
