import FormActions from '@/components/Forms/FormActions/FormActions';
import Button from '@/components/UI/Button/Button';
import { positionUrls } from '../Positions.routes';
import type { PositionDetailsPermissions } from '../Positions.types';

interface PositionDetailsActionsProps {
    positionId: number;
    permissions: PositionDetailsPermissions;
    /** Exclusão em andamento. */
    busy: boolean;
    /** Texto de processamento exibido no rodapé. */
    status?: string;
    onDelete: () => void;
}

/** Rodapé fixo da visualização: voltar, editar e excluir. */
export default function PositionDetailsActions({
    positionId,
    permissions,
    busy,
    status,
    onDelete,
}: PositionDetailsActionsProps): React.JSX.Element {
    return (
        <FormActions status={status}>
            <Button
                href={positionUrls.index}
                tone="cancel"
                label="Voltar"
                title="Voltar para cargos"
                aria-label="Voltar para cargos"
                disabled={busy}
            />
            {permissions.update ? (
                <Button
                    href={positionUrls.edit(positionId)}
                    tone="warning"
                    leftIconClass="fa fa-pencil"
                    label="Editar"
                    title="Editar cargo"
                    aria-label="Editar cargo"
                    disabled={busy}
                />
            ) : null}
            {permissions.delete ? (
                <Button
                    tone="dark-red"
                    leftIconClass="fa fa-trash-o"
                    label="Excluir"
                    title="Excluir cargo"
                    aria-label="Excluir cargo"
                    disabled={busy}
                    onClick={onDelete}
                />
            ) : null}
        </FormActions>
    );
}
