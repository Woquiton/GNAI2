import FormActions from '@/components/Forms/FormActions/FormActions';
import Button from '@/components/UI/Button/Button';
import { itemUrls } from '../Items.routes';
import type { ItemDetailsPermissions } from '../Items.types';

interface ItemDetailsActionsProps {
    itemId: number;
    permissions: ItemDetailsPermissions;
    deleting: boolean;
    onDelete: () => void;
}

/** Rodapé fixo da visualização: PDF à esquerda; voltar, clonar, editar e excluir ao centro. */
export default function ItemDetailsActions({
    itemId,
    permissions,
    deleting,
    onDelete,
}: ItemDetailsActionsProps): React.JSX.Element {
    const pdfAction = permissions.pdf ? (
        <Button
            href={itemUrls.pdf(itemId)}
            target="_blank"
            rel="noopener noreferrer"
            tone="dark-red"
            leftIconClass="fa fa-file-pdf-o"
            label="PDF"
            aria-label="Exportar item em PDF"
        />
    ) : undefined;

    return (
        <FormActions secondary={pdfAction}>
            <Button
                href={itemUrls.index}
                tone="cancel"
                label="Voltar"
                aria-label="Voltar para itens"
                disabled={deleting}
            />
            {permissions.clone ? (
                <Button
                    href={itemUrls.clone(itemId)}
                    tone="white"
                    leftIconClass="fa fa-copy"
                    label="Clonar"
                    aria-label="Clonar item"
                />
            ) : null}
            {permissions.edit ? (
                <Button
                    href={itemUrls.edit(itemId)}
                    tone="warning"
                    leftIconClass="fa fa-pencil"
                    label="Editar"
                    aria-label="Editar item"
                />
            ) : null}
            {permissions.destroy ? (
                <Button
                    tone="dark-red"
                    leftIconClass="fa fa-trash-o"
                    label="Excluir"
                    aria-label="Excluir item"
                    disabled={deleting}
                    onClick={onDelete}
                />
            ) : null}
        </FormActions>
    );
}
