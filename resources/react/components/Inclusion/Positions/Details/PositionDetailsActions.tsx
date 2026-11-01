import FormActions from '@/components/Forms/FormActions/FormActions';
import Button from '@/components/UI/Button/Button';
import { positionUrls } from '../Positions.routes';
import type { PositionDetailsPermissions } from '../Positions.types';

interface PositionDetailsActionsProps {
    positionId: number;
    permissions: PositionDetailsPermissions;
    deleting: boolean;
    onDelete: () => void;
}

/** Rodapé fixo da visualização: voltar, editar e excluir. */
export default function PositionDetailsActions({
    positionId,
    permissions,
    deleting,
    onDelete,
}: PositionDetailsActionsProps): React.JSX.Element {
    return (
        <FormActions>
            <Button
                href={positionUrls.index}
                tone="cancel"
                label="Voltar"
                title="Voltar para cargos"
                aria-label="Voltar para cargos"
                disabled={deleting}
            />
            {permissions.update ? (
                <Button
                    href={positionUrls.edit(positionId)}
                    tone="warning"
                    leftIconClass="fa fa-pencil"
                    label="Editar"
                    title="Editar cargo"
                    aria-label="Editar cargo"
                    disabled={deleting}
                />
            ) : null}
            {permissions.delete ? (
                <Button
                    tone="dark-red"
                    leftIconClass="fa fa-trash-o"
                    label="Excluir"
                    title="Excluir cargo"
                    aria-label="Excluir cargo"
                    disabled={deleting}
                    onClick={onDelete}
                />
            ) : null}
        </FormActions>
    );
}
