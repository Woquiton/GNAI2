import FormActions from '@/components/Forms/FormActions/FormActions';
import Button from '@/components/UI/Button/Button';
import { tagUrls } from '../Tags.routes';
import type { TagDetailsPermissions } from '../Tags.types';

interface TagDetailsActionsProps {
    tagId: number;
    permissions: TagDetailsPermissions;
    deleting: boolean;
    onDelete: () => void;
}

/** Rodapé fixo da visualização: voltar, editar e excluir. */
export default function TagDetailsActions({
    tagId,
    permissions,
    deleting,
    onDelete,
}: TagDetailsActionsProps): React.JSX.Element {
    return (
        <FormActions>
            <Button
                href={tagUrls.index}
                tone="cancel"
                label="Voltar"
                aria-label="Voltar para etiquetas"
                disabled={deleting}
            />
            {permissions.edit ? (
                <Button
                    href={tagUrls.edit(tagId)}
                    tone="warning"
                    leftIconClass="fa fa-pencil"
                    label="Editar"
                    aria-label="Editar etiqueta"
                    disabled={deleting}
                />
            ) : null}
            {permissions.destroy ? (
                <Button
                    tone="dark-red"
                    leftIconClass="fa fa-trash-o"
                    label="Excluir"
                    aria-label="Excluir etiqueta"
                    disabled={deleting}
                    onClick={onDelete}
                />
            ) : null}
        </FormActions>
    );
}
